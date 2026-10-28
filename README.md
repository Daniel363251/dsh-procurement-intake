# 采购工作台（DeepSeek Harness 插件）

`@hilda-biz/dsh-procurement-intake` —— 面向采购员的「模块 A：NC 请购单导入与采购需求整理」插件。它提供一个右侧栏图形面板，并与 Harness 的 AI（Agent）共享同一份宿主侧数据。

## 功能总览

- **NC 请购单导入**：浏览器内解析 `.xls` / `.xlsx`，按常见 NC 表头识别列，预览前 5 行，支持多工作表切换，标记缺关键信息/重复标识的行。
- **物料关键词筛选**：支持空格、逗号、中文逗号、分号、`|` 分隔多词（任一命中），服务端筛选后分页。
- **认领（claim）**：勾选待筛选明细 → 「认领为我的需求」，支持跨页勾选后一起认领。
- **我的需求**：独立的已认领视图，支持查看需求详情、更新供应商/预计发货日期/下一步待办/等待对象/备注并查看操作记录；采购订单状态根据关联订单同步，没有匹配订单时显示「未匹配采购单」。支持批量更新供应商、批量更新发货日期和批量删除。
- **订单交付**：一次选择最多 10 个采购订单 `.xls` / `.xlsx` 文件；浏览器解析订单编号、双方信息、商品明细、金额、交付信息和合同条款，确认预览后保存到宿主存储，并在分页列表查看订单和展开明细。订单编号重复时跳过，不覆盖已导入记录；变更订单状态时会同步更新唯一关联的已认领需求。
- **AI 智能表格**：内置排序、筛选、分页、填色、分组、添加 AI 字段和列设置（调整字段顺序与显隐，按「待筛选 / 我的需求」分别保存在当前浏览器；复用 `@enterprise/ai-table`，锁定 smart 模式）。
- **AI 能力（接真 LLM）**：AI 筛选、AI 填色、AI 字段逐行计算，走 `deepseek-account`（PKCE 登录态）模型。
- **模型设置**：面板内可选模型与推理强度，持久化到宿主。

## 目录结构

```
plugins/dsh-procurement-intake/
├── index.js                              # 稳定宿主入口，转发到 src/host
├── src/
│   ├── host/                              # Harness 宿主能力与业务服务
│   │   ├── index.js
│   │   ├── schemas.js
│   │   ├── list-query.js
│   │   ├── ai-generation.js
│   │   ├── procurement-domain-service.js  # 采购领域规则与存储操作
│   │   ├── procurement-service.js         # Typert / Agent 对外适配
│   │   └── imports/parse-nc-workbook.js
│   └── client/                            # 浏览器侧面板
│       ├── index.cjs                      # Harness 客户端注册入口
│       ├── app/                            # 面板组合与路由
│       ├── features/                      # 按采购业务功能组织的视图和状态
│       │   ├── imports/
│       │   ├── master-data/
│       │   ├── orders/
│       │   ├── requisitions/
│       │   ├── settings/
│       │   └── workspace/
│       ├── components/                    # 跨功能展示组件
│       ├── hooks/                          # 通用交互 hooks
│       ├── imports/                        # 浏览器 Excel 解析
│       ├── lib/                             # AI 与数据访问适配
│       ├── locales.cjs
│       └── styles.cjs
├── client.source.cjs                      # 稳定客户端构建入口（转发到 src/client）
├── client.js                              # 客户端构建产物（Harness 加载）
├── build-client.mjs                       # 客户端构建脚本
├── remote-def.js                          # Typert 远程协议定义
├── typert.host.js                         # 宿主 Typert manifest
├── typert.remote-client.js                # 客户端 Typert remote 信息
├── vendor/ai-table/                       # 内置的 @enterprise/ai-table 构建产物
├── vendor/hilda-ui/                       # 插件使用的 Hilda UI 组件与样式
├── package.json
└── cordis.patch.yml                        # bundle patch
```

## 架构

```
浏览器面板（client.js）
   │  ctx.remote.$mount(TYPERT_REMOTE) → ctx.get('remote.procurement')
   ▼
Typert 远程协议（/api/procurement/*）
   │
   ▼
宿主 ProcurementService（TypertRemoteService）
   ├── 存储域 storageDomain（procurement.json）
   ├── Agent 工具（procurement_*，ctx.tools.register）
   └── LLM 调用（ctx.llm.stream，deepseek-account）
```

- 面板与 Agent 走**同一套宿主服务层**，读写同一份数据。
- 宿主入口 `index.js` 只转发到 `src/host/index.js`；协议适配、采购领域逻辑、查询规则、数据 schema、导入解析和 AI 生成分别维护。
- 客户端 `client.js` 由 `client.source.cjs` 经 esbuild 打包；稳定入口转发到 `src/client/index.cjs`。面板组合、功能视图/状态、共享组件、通用 hooks、数据访问和样式分别维护。
- `client.js` 是生成产物，修改客户端时应编辑 `src/client/` 源码并运行 `npm run build`。`external` 仅保留 `react` / `react-dom`（由 Harness 提供）；AI 表格和 Hilda UI 组件源码随插件目录提供，构建不读取主项目的 `packages/` 或 `ai-table-plugin/`。

## 数据模型

### 采购明细（宿主存储域）

`requisitionLineSchema`（zod）主要字段：

| 字段 | 含义 |
|---|---|
| `id` / `identityKey` | 明细标识 / 合并识别键（含 `\|`、`#`、`:`，故整体存单文件） |
| `requisitionNo` / `lineNo` | 请购单号 / 行号 |
| `materialCode` / `materialName` / `materialCategory` | 物料编码 / 物料名称 / 物料分类 |
| `specification` / `model` / `unit` | 规格 / 型号 / 单位 |
| `quantity` / `remainingQuantity` | 数量 / 未到货数量 |
| `demandDate` / `suggestedOrderDate` | 需求日期 / 建议下单日期 |
| `purchaseOrderNo` / `supplier` | 采购订单号 / 供应商（采购员人工判断填写，重新导入时保留） |
| `expectedShipAt` / `buyerEtaFromFile` | 预计发货时间（采购员填 / 文件自带） |
| `isMine` | 是否已认领 |
| `orderStatus` / `nextAction` / `waitingOn` / `notes` | 订单办理状态 / 下一步 / 等待对象 / 备注 |
| `confirmedAt` / `confirmationBatchId` | 认领时间 / 认领批次 |
| `needsReview` / `reviewReason` | 待复核标记 / 原因 |
| `sourceFields` | 原始列字段（兜底） |
| `activityLog` | 操作日志 |

### 采购订单（宿主存储域）

采购订单按订单编号去重，保存订单双方、日期、金额与税率、商品明细、交付信息、付款条款、其他条款、来源文件名和导入时间。订单列表按导入时间倒序分页。

### 全局（同一存储文件）

- `latestImport`：最近一次导入信息。
- `modelSettings`：`{ model, reasoningEffort }`（模型设置，默认 `deepseek-v4-pro` / `high`）。

## 远程方法（Typert Remote）

客户端通过 `ctx.get('remote.procurement')` 调用，宿主端同名方法在 `ProcurementService` 上：

| 方法 | 参数 | 说明 |
|---|---|---|
| `procurement/list` | `status`（pending/mine/all）、`page`、`pageSize`（≤500）、`sort`（单条或数组）、`filters`（AITableFilterRule[]）、`keywords` | 服务端筛选/排序/关键词后分页，返回 `{ rows, count, statusCount, requisitionCount, matchingRequisitionCount, page, pageSize, contextRows, latestImport }` |
| `procurement/listPurchaseOrders` | `page`、`pageSize`（≤100） | 分页查询已导入的采购订单 |
| `procurement/importPurchaseOrders` | `orders`（1–10） | 持久化浏览器解析出的采购订单；重复订单编号会跳过 |
| `procurement/deletePurchaseOrders` | `ids` | 删除选中的采购订单 |
| `procurement/cancelPurchaseOrders` | `ids` | 将选中订单标记为取消，保留订单数据，并同步关联需求状态 |
| `procurement/notifyPurchaseOrders` | `ids` | 将选中订单标记为已通知供应商；已取消订单跳过，并同步关联需求状态 |
| `procurement/syncOwnedPurchaseOrderNumbers` | — | 从唯一匹配的订单补齐已认领需求缺少的采购订单号，并同步状态 |
| `procurement/search` | `keywords` | 按物料名称关键词搜索（不分组，返回全部命中） |
| `procurement/claim` | `ids` | 认领选中的待筛选明细 |
| `procurement/updateLine` | `id` + `supplier?`/`expectedShipAt?`/`notes?`/`nextAction?`/`waitingOn?` | 更新一条已认领明细的跟进字段；采购订单状态不可手动更新 |
| `procurement/updateSuppliers` | `ids`、`supplier` | 批量更新已认领明细的供应商字段 |
| `procurement/importLines` | `lines`、`fileName`、`sheetName` | 导入浏览器解析出的明细（重复按识别键合并，保留已认领状态与采购员字段） |
| `procurement/clearPending` | — | 清空所有未认领的待筛选明细 |
| `procurement/deleteOwned` | `ids` | 删除已认领明细 |
| `procurement/aiGenerate` | `operation`（filters/colors/field-preview）、`payload`、`sessionId?` | AI 生成：自然语言 → 结构化规则 / 逐行字段值 |
| `procurement/listModelOptions` | — | 列出 `deepseek-account` 可用模型与推理强度 |
| `procurement/getModelSettings` | — | 读取持久化的模型设置 |
| `procurement/updateModelSettings` | `model`、`reasoningEffort` | 保存模型设置 |

## Agent 工具

宿主注册了以下工具，Agent 与面板共用同一服务层：

| 工具 | 参数 | 说明 |
|---|---|---|
| `procurement_list` | `status` | 查看采购需求明细（待筛选/我的/全部） |
| `procurement_search` | `keywords` | 按物料名称关键词搜索 |
| `procurement_claim` | `ids` | 批量认领 |
| `procurement_update_line` | `id` + 跟进字段（含 `supplier`） | 更新一条已认领明细 |
| `procurement_update_supplier` | `ids`、`supplier` | 批量更新供应商 |
| `procurement_import` | `file_path` | 从工作区路径导入 NC 请购单 Excel |
| `procurement_clear_pending` | — | 清空待筛选池 |
| `procurement_delete_owned` | `ids` | 删除已认领明细 |

## AI 能力

三个操作（`procurement/aiGenerate` 的 `operation`）：

| 操作 | 输入 → 输出 | 结果去向 |
|---|---|---|
| `filters` | 自然语言指令 + 字段元数据 → `AITableFilterRule[]` | 回传服务端 `list.filters` 查询 |
| `colors` | 自然语言指令 + 字段元数据 → `AITableColorRule[]` | 前端对当前页上色 |
| `field-preview` | 字段定义 + 行数据 → `[{ rowKey, value | error }]` | 逐行计算（一次 ≤ 50 行） |

关键设计：

- **模型路由**：固定使用 `deepseek-account`（PKCE 登录态，与当前 Agent 同一条路径），模型与推理强度由用户在「模型设置」页选择并持久化。注意：`agentDefaultModel.currentSelection()` 返回的是默认 provider（可能为 `deepseek-official`，需 `DEEPSEEK_API_KEY`），故此处显式指定 `deepseek-account`。
- **严格校验**：LLM 输出的 `fieldId`/`operator`/`colorToken`/`scope`/结果类型都会校验，非法即报错让用户重试，不静默接受。
- **重试**：对 `TRANSPORT / SERVER / TIMEOUT / RATE_LIMIT / EMPTY_RESPONSE / UNKNOWN` 自动重试（最多 3 次，退避 1s/2s）；账户类错误（如 `MISSING_CREDENTIAL`）立即抛出。
- **流式调用**：`ctx.llm.stream` 累加 `text-delta`；`finish` 的 `reason.kind === 'error'` 会被转成明确报错。

## 持久化

| 数据 | 位置 | 刷新后 | 跨浏览器/机器 |
|---|---|---|---|
| 采购明细、latestImport、modelSettings | 宿主 `~/.dsh/storages/procurement.json` | ✅ | ✅（单机单 buyer 全局） |
| 表格列设置（字段顺序/显隐） | 浏览器 localStorage `hilda:dsh-procurement-intake:procurement.{pending-lines\|owned-lines}:columns:v2` | ✅ | ❌ |
| AI 字段定义（视图配置） | 浏览器 localStorage `ai-table-plugin:v1:<tableKey>:view` | ✅ | ❌ |
| AI 字段计算结果 | 浏览器 localStorage `ai-table-plugin:v1:<tableKey>:ai-values` | ✅ | ❌ |

> `<tableKey>` 为表格标识，等于 `JSON.stringify([storageScope, tableId])`，即 `["hilda:dsh-procurement-intake","procurement.pending-lines"]` 或 `["hilda:dsh-procurement-intake","procurement.owned-lines"]`。

> AI 字段是「灵活的扩展字段」：不进入明细 schema，作为视图配置挂载，可增可删；删除时会连带清理其计算结果（`clearAIFieldValues`）。若需让 AI（Agent）也能读到 AI 字段结果，需另行把定义与结果同步到宿主存储域。

## 构建与安装

仓库会提交可直接加载的 `client.js` 和 `dist/` 宿主构建产物。只把克隆目录链接进 Harness 时，不需要在插件目录单独安装 `zod` 或 `xlsx`；宿主构建已经把这些运行时依赖打包进去，Harness 仍提供 `@deepseek-ai/dsh-*` peer 依赖。

修改源码并重新构建时：

```sh
cd plugins/dsh-procurement-intake
npm ci
npm run build          # 构建 dist/ 宿主入口、Typert schema 和 client.js
```

然后用 Harness 的插件管理器把该目录作为 bundle 安装（`plugin_manager install_bundle` 指向本目录，等价于将 `@hilda-biz/dsh-procurement-intake` 链接进当前 profile）。安装后刷新页面即可；修改宿主侧（`index.js` / `remote-def.js`）或客户端后需重新 `remove_bundle` + `install_bundle`（或重启 Harness）并刷新页面。

## 本地浏览器预览

在插件仓库构建好产物，并确认插件已安装到要预览的 Harness profile 后，在 **DeepSeek Harness 仓库**启动 Web 开发环境（不要在插件仓库中运行 `dev:web`）：

```sh
cd /path/to/deepseek-harness
pnpm run dev:web --no-open
```

`dev:web` 会先构建 Harness，再启动 Web 服务和客户端插件构建 watcher。服务默认监听 `http://127.0.0.1:3080/`；`--no-open` 会关闭自动打开系统浏览器，启动后可在浏览器中访问该地址。开发期间按 `Ctrl+C` 停止服务和 watcher。修改本插件源码后，先在插件仓库运行 `npm run build`，再刷新预览页面；修改宿主入口或协议后，重启 Web 开发环境以重新加载插件。

本地验证使用 Node 24.18.0；Node 24.4.1 会在 watcher 启动时因模块加载 hook 报错退出。

## 从 GitHub 安装（给新用户）

发布到 GitHub 时，仓库需包含：所有宿主/客户端源码、`client.js`、`dist/`、`vendor/ai-table/`、`package.json`、`package-lock.json`（`node_modules/` 已由 `.gitignore` 排除）。新用户按以下步骤即可运行：

```sh
git clone <仓库地址>
cd dsh-procurement-intake
```

然后在 Harness 里用插件管理器 `install_bundle` 指向该目录并刷新页面。仓库提交的构建产物不依赖插件目录的 `node_modules`；需要自行修改源码时，再运行 `npm ci && npm run build`。

**版本要求**：`@deepseek-ai/dsh-*` 以 peer 依赖声明（由宿主 DSH 提供，插件不再自带副本），`engines.dsh` 为 `>=0.2.1-rc.1 <0.3.0`。用户的 Harness 在 0.2.x（≥0.2.1-rc.1）范围内即可，超出范围会在安装/激活阶段被拦截。

## 更新内置组件

插件构建只读取当前目录中的文件。`vendor/ai-table/` 保存 AI 表格的构建产物；`vendor/hilda-ui/` 保存本插件使用的 Hilda UI 组件源码，以及 `controls.css` 中的按钮、下拉选择和提示样式副本。更新上游组件时，在上游仓库构建后将对应产物或源文件同步到这两个目录，再从插件目录重建客户端：

```sh
cd dsh-procurement-intake
npm run build   # 使用插件目录中的 vendor 依赖重打 client.js
```

上游同步步骤只在主动升级内置组件时需要；克隆本仓库后，安装依赖并构建无需主项目源码。

## 许可证

本项目原创代码按 MIT 许可证发布，见 [LICENSE](./LICENSE)。客户端 bundle 也包含第三方依赖代码；其上游许可证注释会保留在 `client.js` 文件末尾，依赖版本与许可证元数据见 `package-lock.json`。
