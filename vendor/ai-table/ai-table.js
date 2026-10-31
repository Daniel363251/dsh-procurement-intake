import * as e from "react";
import { useCallback as t, useEffect as n, useMemo as r, useRef as i, useState as a } from "react";
import { Fragment as o, jsx as s, jsxs as c } from "react/jsx-runtime";
import { ArrowDown as l, ArrowUp as u, ArrowUpDown as d, Bot as f, Calendar as p, Check as m, CheckCircle2 as h, CheckIcon as g, ChevronDown as _, ChevronDownIcon as v, ChevronLeftIcon as y, ChevronRightIcon as b, ChevronUpIcon as x, ChevronsLeft as S, ChevronsLeftIcon as C, ChevronsRight as w, ChevronsRightIcon as T, Clock as E, Columns3Icon as D, Copy as O, Filter as k, GripVertical as A, Hash as j, HelpCircle as M, LayoutList as N, List as P, Loader2 as F, LoaderCircle as ee, Palette as te, Pin as ne, Plus as I, RefreshCw as re, RotateCcw as L, Settings2 as R, Sparkles as z, Table2 as ie, Tag as B, ThumbsDown as ae, ThumbsUp as oe, Trash2 as V, Type as se, UserRound as ce, X as le, XIcon as ue } from "lucide-react";
import { cva as de } from "class-variance-authority";
import { AlertDialog as H, Checkbox as U, Dialog as fe, DropdownMenu as pe, Label as me, Popover as he, Progress as ge, Select as W, Slot as _e, Tabs as ve, Tooltip as ye } from "radix-ui";
import { clsx as be } from "clsx";
import { twMerge as xe } from "tailwind-merge";
import { flexRender as Se, getCoreRowModel as Ce, getFilteredRowModel as we, getSortedRowModel as Te, useReactTable as Ee } from "@tanstack/react-table";
import { DndContext as De, DragOverlay as Oe, PointerSensor as G, closestCenter as ke, useSensor as K, useSensors as Ae } from "@dnd-kit/core";
import { SortableContext as je, arrayMove as Me, useSortable as Ne, verticalListSortingStrategy as Pe } from "@dnd-kit/sortable";
import { CSS as Fe } from "@dnd-kit/utilities";
var q = {
	aiTable: {
		toolbar: {
			filter: "筛选",
			group: "分组",
			sort: "排序",
			color: "填色",
			addField: "添加字段",
			savedView: "已保存视图",
			groupSummaryByField: "按{{field}}分组"
		},
		draftBar: {
			filter: "筛选",
			group: "分组",
			sort: "排序",
			color: "填色",
			aiField: "AI 字段",
			view: "视图",
			viewSaved: "视图已保存",
			adjustedConfig: "你调整了{{label}}配置",
			cancel: "取消",
			save: "保存"
		},
		filter: {
			title: "筛选",
			placeholder: "告诉 AI 你想看到什么。例如：今天发货并且存在缺货的订单",
			generated: "已按\"{{instruction}}\"生成筛选条件",
			noConditions: "没有识别到可用条件，请换一种更具体的描述",
			generateFailed: "生成失败，请重试",
			generating: "正在按\"{{instruction}}\"生成筛选条件",
			feedbackHelpful: "反馈有帮助",
			feedbackUnhelpful: "反馈无帮助",
			copyInstruction: "复制生成说明",
			conditionDescription: "在当前视图，显示符合以下条件的记录",
			when: "当",
			and: "且",
			or: "或",
			addCondition: "添加条件",
			addConditionGroup: "添加筛选条件组",
			deleteCondition: "删除筛选条件 {{index}}"
		},
		group: {
			title: "按指定字段分组",
			collapseAll: "折叠所有",
			expandAll: "展开所有",
			optionOrder: "选项顺序",
			optionReverse: "选项逆序",
			addGroup: "添加分组",
			emptyHint: "选择一个字段，把当前页记录整理成可折叠分组",
			apply: "应用",
			deleteGroup: "删除分组 {{index}}"
		},
		sort: {
			title: "按以下条件排序",
			addSort: "添加排序条件",
			emptyHint: "添加字段，让当前页记录按优先级依次排序",
			apply: "应用",
			dragHint: "拖动调整排序条件 {{index}} 的优先级",
			asc: "排序条件 {{index}} 升序",
			desc: "排序条件 {{index}} 降序",
			deleteSort: "删除排序条件 {{index}}"
		},
		color: {
			title: "填色",
			placeholder: "描述哪些内容用什么颜色。例如：缺货大于 3 的单元格标红",
			generated: "已生成 {{count}} 条填色规则",
			noRules: "没有识别到可用的填色规则",
			generateFailed: "生成失败，请重试",
			generating: "正在生成填色规则…",
			ruleDescription: "按以下规则进行填色",
			smartColor: "智能配色",
			columnHint: "整列持续高亮，无需设置条件",
			addRule: "添加填色条件",
			apply: "应用",
			dragHint: "拖动调整填色条件 {{index}} 的优先级",
			deleteRule: "删除填色条件 {{index}}",
			backgroundFill: "背景色填充",
			selectColor: "选择填色颜色，当前为{{label}}",
			selectScope: "选择填色范围，当前为{{label}}",
			scopeMenu: "填色范围"
		},
		aiField: {
			title: "AI 字段",
			close: "关闭 AI 字段",
			createdFields: "已创建的 AI 字段",
			fieldName: "字段名称",
			fieldNamePlaceholder: "例如：履约风险等级",
			outputType: "输出类型",
			prompt: "提示词",
			promptPlaceholder: "基于以下字段，评估每条记录并只返回需要的结果。",
			insertField: "插入字段",
			sourceDerived: "派生",
			sourceAi: "AI",
			sourceBusiness: "业务",
			generationSettings: "生成设置",
			autoUpdate: "自动更新",
			autoUpdateTooltip: "当引用字段内容变化时，AI 字段将自动重新生成",
			allowEmptyReferences: "允许引用字段的值为空",
			allowEmptyReferencesTooltip: "引用字段值为空时，不影响 AI 内容生成",
			preview: "前 5 行预览",
			repreview: "重新预览",
			record: "记录",
			previewColumn: "{{name}}（预览）",
			noRecords: "当前页没有可预览记录",
			cancel: "取消",
			runPreview: "运行前 5 行",
			save: "保存",
			generating: "正在生成…",
			generateFailed: "生成失败",
			skipped: "已跳过：引用字段值为空",
			waiting: "等待生成",
			rerun: "重新运行 {{name}}",
			delete: "删除 {{name}}",
			outputText: "文本",
			outputNumber: "数字",
			outputTag: "标签",
			promptAriaLabel: "AI 字段提示词",
			tokenAriaLabel: "字段：{{label}}",
			tooltipSuffix: "说明"
		},
		modeSwitch: {
			switchingToSmart: "正在切换为智能表格",
			backToClassic: "返回传统表格",
			switchToSmart: "切换为智能表格",
			switching: "正在切换",
			aiTable: "AI 表格",
			discardTitle: "放弃未保存的配置？",
			discardDescription: "当前智能表格存在未保存的配置，切换后将放弃本次修改。",
			cancel: "取消",
			discardAndSwitch: "放弃并切换"
		},
		freeze: {
			frozenColumns: "左侧冻结列",
			columnUnit: "列",
			clearFreeze: "清除冻结",
			hint: "点击 + 冻结左侧列，横向滚动时保持可见"
		},
		loader: {
			title: "正在切换为 AI 智能表格",
			subtitle: "正在识别字段含义，并准备自然语言筛选、智能分组和视图生成能力。",
			statusText: "Preparing smart table",
			askText: "询问这个表格：找出预计到货超时且仍未完成的入库单",
			smartView: "智能视图",
			allDocuments: "全部单据",
			exceptionView: "异常视图",
			groupBySupplier: "按供应商分组",
			arrivalTimeout: "到货超时",
			quantityDiff: "数量差异",
			creatingGroup: "正在创建分组：供应商 / 状态 / 到货风险",
			generatingView: "正在生成视图：到货超时 / 数量差异 / 异常跟进",
			capabilityUnderstanding: "字段理解",
			capabilityFiltering: "自然语言筛选",
			capabilityGrouping: "智能分组",
			capabilityView: "视图生成"
		},
		panelParts: {
			generating: "生成中…",
			generate: "生成",
			cancel: "取消",
			save: "保存"
		},
		valueEditor: {
			selectPlaceholder: "请选择",
			rangeTo: "至",
			inputPlaceholder: "请输入",
			rangeStart: "区间起始值",
			rangeEnd: "区间结束值"
		},
		engine: {
			filterSummary: "按 {{count}} 个字段筛选",
			groupSummary: "按 {{count}} 个字段分组",
			sortSummary: "按 {{count}} 个字段排序",
			sortSummaryByField: "按{{field}}排序",
			sortDefault: "排序 1",
			colorSummary: "填色 {{count}}",
			ungroupedLabel: "未填写"
		},
		operators: {
			equals: "等于",
			notEquals: "不等于",
			contains: "包含",
			notContains: "不包含",
			isEmpty: "为空",
			notEmpty: "不为空",
			greaterThan: "大于",
			lessThan: "小于",
			greaterThanOrEqual: "大于等于",
			lessThanOrEqual: "小于等于",
			between: "区间",
			earlierThan: "早于",
			laterThan: "晚于",
			isToday: "今天",
			isPast: "已过期",
			isFuture: "未来",
			withinPastDays: "过去 N 天内",
			withinNextDays: "未来 N 天内"
		},
		colorPalette: {
			coral: "珊瑚红",
			orange: "橙色",
			yellow: "黄色",
			lime: "青柠",
			green: "绿色",
			teal: "青色",
			cyan: "天蓝",
			blue: "蓝色",
			purple: "紫色",
			pink: "粉色",
			gray: "灰色"
		},
		colorScope: {
			cell: "单元格",
			cellTitle: "按条件高亮关键数据",
			cellDesc: "自动为满足规则的单元格着色，一眼锁定异常值、达标项、优先级记录等。",
			row: "整行",
			rowTitle: "按条件高亮整行",
			rowDesc: "满足规则的整行自动着色，让关联字段一目了然，强化业务记录完整性。",
			rowMarker: "行侧",
			rowMarkerTitle: "行侧填色",
			rowMarkerDesc: "在行号左侧显示颜色标记，根据条件快速识别关键行，不遮挡任何数据。",
			column: "整列",
			columnTitle: "整列填色",
			columnDesc: "高亮整列以便突出显示。",
			previewTask: "任务",
			previewPriority: "优先级",
			previewStatus: "状态"
		},
		dataView: {
			noFilteredRecords: "当前页没有符合智能筛选条件的记录",
			scopeNote: "当前页演示 · 已加载 {{filtered}} 条 / 原查询共 {{total}} 条"
		},
		badge: {
			highRisk: "高风险",
			mediumRisk: "中风险",
			lowRisk: "低风险",
			attention: "需关注",
			normal: "正常"
		},
		mock: {
			generateFailed: "生成失败",
			publishRemark: "AI 生成并发布"
		}
	},
	wms: {
		group: { selectRows: "选择分组 {{label}} 中的 {{count}} 条记录" },
		rowActions: { srLabel: "操作" },
		summary: {
			total: "合计",
			placeholder: "点击右侧设置选择汇总字段",
			settings: "设置",
			selectAll: "全部",
			restoreDefault: "恢复默认"
		},
		timeline: {
			completed: "完成",
			details: "查看详情"
		},
		columnSettings: {
			density: {
				compact: "紧凑",
				medium: "中等",
				relaxed: "宽松"
			},
			pinned: "固定",
			groupOther: "其他",
			title: "列设置",
			rowHeight: "表格行高",
			unselectAll: "取消全选",
			selectAll: "全选",
			required: "必选",
			selected: "已选",
			dragHint: "拖拽调整列顺序",
			restoreDefault: "恢复默认",
			cancel: "取消",
			save: "保存"
		},
		column: "列",
		freeze: {
			dragLabel: "拖拽调整左侧冻结列",
			tooltip: "拖拽可调整冻结区域"
		},
		pagination: {
			selectedRows: "已选 {{selected}} 行，共 {{total}} 条",
			totalRecords: "共 {{total}} 条",
			rowsPerPage: "每页行数",
			pageInfo: "第 {{page}} / {{total}} 页"
		},
		selectedCount: "已选 {{count}} 条",
		changeAudit: {
			tableAria: "配置变更审计",
			version: "版本",
			action: "动作",
			occurredAt: "实际时间",
			actor: "操作人",
			reason: "变更原因",
			summary: "变更摘要",
			fieldChanges: "字段变更",
			field: "字段",
			before: "变更前",
			after: "变更后",
			notSet: "未设置",
			removed: "已移除",
			noFieldDiff: "本次变更没有字段级差异。",
			empty: "暂无变更记录",
			expand: "展开",
			collapse: "收起",
			toggleAria: "{{state}} {{version}} 的字段变更",
			fieldChangesAria: "{{action}}字段变更"
		},
		activity: {
			records: "执行记录",
			occurredAt: "实际时间",
			action: "动作",
			actor: "操作人"
		}
	},
	common: {
		action: {
			confirm: "确定",
			cancel: "取消",
			save: "保存",
			edit: "编辑",
			delete: "删除",
			detail: "详情",
			search: "查询",
			reset: "重置",
			export: "导出",
			import: "导入",
			batchConfirm: "批量确认",
			close: "关闭",
			submit: "提交",
			back: "返回",
			refresh: "刷新",
			more: "更多",
			expand: "展开",
			collapse: "收起",
			logout: "退出登录",
			resetDemo: "重置演示数据",
			confirmReset: "确认重置",
			switchWarehouse: "切换仓库",
			confirmSwitch: "确认切换",
			switching: "切换中…",
			askAi: "问问 Nexus AI",
			processing: "提交中…",
			submitting: "提交中…",
			create: "新建",
			disable: "禁用",
			enable: "启用",
			expandAll: "展开全部",
			collapseAll: "收起全部",
			done: "完成",
			view: "查看",
			viewDetail: "查看详情",
			saving: "保存中…",
			retry: "重试",
			backToList: "返回列表",
			remove: "移除",
			saveChanges: "保存变更"
		},
		status: {
			enabled: "启用",
			disabled: "停用",
			success: "成功",
			failed: "失败",
			pending: "待处理",
			processing: "处理中",
			completed: "已完成",
			cancelled: "已取消",
			deleting: "删除中…",
			loading: "加载中…"
		},
		label: {
			total: "共",
			items: "条",
			page: "页",
			pageSize: "条/页",
			noData: "暂无数据",
			loading: "加载中...",
			all: "全部",
			selectPlaceholder: "请选择",
			inputPlaceholder: "请输入",
			searchPlaceholder: "请输入关键词搜索",
			operation: "操作",
			remark: "备注",
			creator: "创建人",
			createTime: "创建时间",
			modifier: "修改人",
			modifyTime: "修改时间",
			noWarehouse: "未选择仓库",
			noWarehouseAvailable: "暂无仓库",
			aiFeatures: "AI 功能",
			labScene: "实验室场景",
			sceneLab: "场景工作台实验室",
			sceneLabDesc: "选择当前要分析和处理的业务场景",
			currentScene: "当前场景",
			switchable: "可切换",
			moreFilters: "更多筛选",
			firstPage: "首页",
			prevPage: "上一页",
			nextPage: "下一页",
			lastPage: "末页",
			status: "状态",
			aiAnalyzed: "AI 已分析",
			none: "无",
			optional: "选填",
			yes: "是",
			no: "否",
			completeTime: "完成时间",
			selectDateRange: "选择日期范围",
			unassigned: "未分配",
			selectedCount: "已选 {{count}} 项",
			operationFailed: "操作失败",
			submitting: "提交中…",
			processing: "处理中…"
		},
		msg: {
			saveSuccess: "保存成功",
			deleteSuccess: "删除成功",
			operateSuccess: "操作成功",
			operateFailed: "操作失败",
			confirmDelete: "确定要删除选中的记录吗?",
			confirmBatchDelete: "确定要删除选中的 {{count}} 条记录吗?",
			noSelection: "请先选择记录",
			required: "必填项不能为空",
			networkError: "网络异常,请稍后重试",
			resetSuccess: "演示数据已重置",
			resetConfirmDesc: "确认重置所有演示数据到初始状态？当前的操作记录和状态变更将全部清除。",
			upgradeOms: "订单管理系统正在升级中，敬请期待",
			upgradeTms: "运输管理系统正在升级中，敬请期待",
			upgradeBilling: "计费管理系统正在升级中，敬请期待",
			switchWarehouseFailed: "切换仓库失败",
			confirmSwitchWarehouse: "确认切换到「{{name}}」吗？切换后页面将刷新。",
			createSuccess: "创建成功",
			createFailed: "创建失败",
			saveFailed: "保存失败",
			deleteFailed: "删除失败",
			enableSuccess: "启用成功",
			disableSuccess: "禁用成功",
			batchEnableSuccess: "批量启用成功",
			batchDisableSuccess: "批量禁用成功",
			irreversible: "此操作不可撤销。",
			loadFailed: "加载失败，请重试"
		},
		app: {
			title: "WMS 仓储管理系统",
			oms: "订单管理系统",
			tms: "运输管理系统",
			billing: "计费管理系统"
		},
		user: { defaultName: "管理员" },
		conflict: {
			title: "数据已被他人修改",
			description: "该订单已被其他用户修改，请刷新后重试。"
		},
		placeholder: {
			input: "请输入",
			dateRange: "选择日期范围",
			remarkOptional: "选填，最长200字",
			remarkMax: "最多 200 字",
			selectDate: "选择日期",
			selectDateRange: "选择日期范围"
		},
		searching: "搜索中…",
		column: { action: "操作" },
		unit: { pieces: "件" },
		all: "全部",
		selectedCount: "已选 {{count}} 项",
		tooltip: { inDevelopment: "功能开发中" },
		switch: {
			on: "已开启",
			off: "已关闭"
		},
		tab: {
			active: "启用中",
			empty: "空库位",
			inactive: "已停用",
			occupied: "已占用"
		},
		desc: { remarkOptional: "选填，最多 200 字符。" },
		toast: {
			copied: "已复制到剪贴板",
			operationFailed: "操作失败"
		},
		field: {
			skuCode: "SKU编码",
			skuName: "SKU名称",
			batchNo: "批次号"
		},
		ai: { analyzed: "AI 已分析" },
		dirtyGuard: {
			title: "确认放弃？",
			description: "当前表单有未保存的修改，确认放弃后内容将丢失。",
			continueEditing: "继续编辑",
			confirmDiscard: "确认放弃"
		},
		aria: { clearDate: "清空日期" },
		loading: "加载中…",
		formReview: { title: "请确认以下信息" },
		password: { help: "8-20 位，必须包含大小写字母、数字、特殊字符" }
	}
};
//#endregion
//#region src/i18n/index.ts
function Ie(e, t = "") {
	let n = {};
	for (let [r, i] of Object.entries(e)) {
		let e = t ? `${t}.${r}` : r;
		i && typeof i == "object" ? Object.assign(n, Ie(i, e)) : typeof i == "string" && (n[e] = i);
	}
	return n;
}
var Le = Ie(q);
function Re(e, t) {
	let n = Le[e];
	if (n == null && typeof t == "string" && (n = t), n == null) return e;
	if (t && typeof t == "object") for (let [e, r] of Object.entries(t)) n = n.split(`{{${e}}}`).join(String(r));
	return n;
}
function J() {
	return { t: Re };
}
var Y = { t: Re };
//#endregion
//#region src/components/ai-table/types.ts
function ze() {
	return {
		filters: [],
		groups: [],
		sorts: [],
		collapsedGroupKeys: [],
		colorRules: [],
		aiFields: [],
		frozenColumnCount: 1
	};
}
function Be(e) {
	switch (e) {
		case "text": return [
			{
				value: "equals",
				label: Y.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: Y.t("aiTable.operators.notEquals")
			},
			{
				value: "contains",
				label: Y.t("aiTable.operators.contains")
			},
			{
				value: "notContains",
				label: Y.t("aiTable.operators.notContains")
			},
			{
				value: "isEmpty",
				label: Y.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: Y.t("aiTable.operators.notEmpty")
			}
		];
		case "number": return [
			{
				value: "equals",
				label: Y.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: Y.t("aiTable.operators.notEquals")
			},
			{
				value: "greaterThan",
				label: Y.t("aiTable.operators.greaterThan")
			},
			{
				value: "lessThan",
				label: Y.t("aiTable.operators.lessThan")
			},
			{
				value: "greaterThanOrEqual",
				label: Y.t("aiTable.operators.greaterThanOrEqual")
			},
			{
				value: "lessThanOrEqual",
				label: Y.t("aiTable.operators.lessThanOrEqual")
			},
			{
				value: "between",
				label: Y.t("aiTable.operators.between")
			},
			{
				value: "isEmpty",
				label: Y.t("aiTable.operators.isEmpty")
			}
		];
		case "tag": return [
			{
				value: "equals",
				label: Y.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: Y.t("aiTable.operators.notEquals")
			},
			{
				value: "isEmpty",
				label: Y.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: Y.t("aiTable.operators.notEmpty")
			}
		];
		case "date":
		case "datetime": return [
			{
				value: "equals",
				label: Y.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: Y.t("aiTable.operators.notEquals")
			},
			{
				value: "greaterThan",
				label: Y.t("aiTable.operators.earlierThan")
			},
			{
				value: "lessThan",
				label: Y.t("aiTable.operators.laterThan")
			},
			{
				value: "between",
				label: Y.t("aiTable.operators.between")
			},
			{
				value: "isToday",
				label: Y.t("aiTable.operators.isToday")
			},
			{
				value: "isPast",
				label: Y.t("aiTable.operators.isPast")
			},
			{
				value: "isFuture",
				label: Y.t("aiTable.operators.isFuture")
			},
			{
				value: "withinPastDays",
				label: Y.t("aiTable.operators.withinPastDays")
			},
			{
				value: "withinNextDays",
				label: Y.t("aiTable.operators.withinNextDays")
			},
			{
				value: "isEmpty",
				label: Y.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: Y.t("aiTable.operators.notEmpty")
			}
		];
		default: return [{
			value: "equals",
			label: Y.t("aiTable.operators.equals")
		}];
	}
}
//#endregion
//#region src/components/ai-table/color-palette.ts
var Ve = [
	{
		family: "coral",
		label: Y.t("aiTable.colorPalette.coral"),
		colors: [
			"#fff0ed",
			"#ffe0da",
			"#ffc2b6",
			"#ff9f8e",
			"#ff5c45"
		]
	},
	{
		family: "orange",
		label: Y.t("aiTable.colorPalette.orange"),
		colors: [
			"#fff4e8",
			"#ffe4c7",
			"#ffd09b",
			"#ffb85c",
			"#ff9200"
		],
		darkTextOnLastShade: !0
	},
	{
		family: "yellow",
		label: Y.t("aiTable.colorPalette.yellow"),
		colors: [
			"#fffbe6",
			"#fff4bf",
			"#ffeb85",
			"#ffe15c",
			"#ffd400"
		],
		darkTextOnLastShade: !0
	},
	{
		family: "lime",
		label: Y.t("aiTable.colorPalette.lime"),
		colors: [
			"#f6f9e8",
			"#e9f0c7",
			"#d7e39d",
			"#bfd36f",
			"#9fbd00"
		],
		darkTextOnLastShade: !0
	},
	{
		family: "green",
		label: Y.t("aiTable.colorPalette.green"),
		colors: [
			"#eff8f1",
			"#d9efdd",
			"#b8dfbf",
			"#83ca8f",
			"#08b84a"
		]
	},
	{
		family: "teal",
		label: Y.t("aiTable.colorPalette.teal"),
		colors: [
			"#edf8f7",
			"#d5eeeb",
			"#abe0d9",
			"#6dcec3",
			"#12b3a3"
		]
	},
	{
		family: "cyan",
		label: Y.t("aiTable.colorPalette.cyan"),
		colors: [
			"#ebf8fc",
			"#ceeff8",
			"#9fe0f2",
			"#6ad0ec",
			"#39bfe7"
		],
		darkTextOnLastShade: !0
	},
	{
		family: "blue",
		label: Y.t("aiTable.colorPalette.blue"),
		colors: [
			"#eef3ff",
			"#d9e5ff",
			"#b4cbff",
			"#8aaeff",
			"#4e82ed"
		]
	},
	{
		family: "purple",
		label: Y.t("aiTable.colorPalette.purple"),
		colors: [
			"#f5f1ff",
			"#e8ddff",
			"#d4c0ff",
			"#b99af5",
			"#8b5de7"
		]
	},
	{
		family: "pink",
		label: Y.t("aiTable.colorPalette.pink"),
		colors: [
			"#fff0fa",
			"#f8dced",
			"#efb9df",
			"#e28ecb",
			"#ca55af"
		]
	},
	{
		family: "gray",
		label: Y.t("aiTable.colorPalette.gray"),
		colors: [
			"#f5f5f5",
			"#e7e7e7",
			"#d2d2d2",
			"#b7b7b7",
			"#8e8e8e"
		]
	}
], He = [
	1,
	2,
	3,
	4,
	5
].map((e) => Ve.map((t) => ({
	value: `${t.family}${e}`,
	label: `${t.label} ${e}`,
	backgroundColor: t.colors[e - 1],
	foregroundColor: e === 5 && !t.darkTextOnLastShade ? "#ffffff" : "#20242d"
}))), Ue = He.flat(), We = new Map(Ue.map((e) => [e.value, e])), Ge = {
	red: "coral4",
	lightRed: "coral2",
	green: "green4",
	lightGreen: "green2",
	yellow: "yellow3",
	blue: "blue4",
	lightBlue: "blue2"
};
function Ke(e) {
	let t = Ge[e] ?? e;
	return We.get(t) ?? We.get("coral4");
}
function qe(e) {
	if (!e) return;
	let t = Ke(e);
	return {
		backgroundColor: t.backgroundColor,
		color: t.foregroundColor
	};
}
function Je(e) {
	if (e) return { boxShadow: `inset 3px 0 0 ${Ke(e).backgroundColor}` };
}
//#endregion
//#region src/components/ai-table/ai-table-engine.ts
function Ye(e, t) {
	return e.find((e) => e.fieldId === t);
}
function Xe(e, t, n, r) {
	let i = (r === "date" || r === "datetime") && n === "today" ? ft(/* @__PURE__ */ new Date()) : n, a = (r === "date" || r === "datetime") && typeof e == "string" ? e.slice(0, 10) : e;
	switch (t) {
		case "isEmpty": return a == null || a === "";
		case "notEmpty": return a != null && a !== "";
		case "equals": return String(a ?? "") === String(i ?? "");
		case "notEquals": return String(a ?? "") !== String(i ?? "");
		case "contains": return String(a ?? "").toLowerCase().includes(String(i ?? "").toLowerCase());
		case "notContains": return !String(a ?? "").toLowerCase().includes(String(i ?? "").toLowerCase());
		case "greaterThan": {
			if (r === "date" || r === "datetime") return String(a ?? "") > String(i ?? "");
			let e = Number(a), t = Number(i);
			return isNaN(e) || isNaN(t) ? !1 : e > t;
		}
		case "lessThan": {
			if (r === "date" || r === "datetime") return String(a ?? "") < String(i ?? "");
			let e = Number(a), t = Number(i);
			return isNaN(e) || isNaN(t) ? !1 : e < t;
		}
		case "greaterThanOrEqual": {
			let e = Number(a), t = Number(i);
			return isNaN(e) || isNaN(t) ? !1 : e >= t;
		}
		case "lessThanOrEqual": {
			let e = Number(a), t = Number(i);
			return isNaN(e) || isNaN(t) ? !1 : e <= t;
		}
		case "between": {
			if (!Array.isArray(i) || i.length !== 2) return !1;
			if (r === "date" || r === "datetime") {
				let e = String(a ?? ""), t = String(i[0] ?? ""), n = String(i[1] ?? "");
				return !!(t && n && e >= t && e <= n);
			}
			let e = Number(a), t = Number(i[0]), n = Number(i[1]);
			return isNaN(e) || isNaN(t) || isNaN(n) ? !1 : e >= t && e <= n;
		}
		case "isToday": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = ft(/* @__PURE__ */ new Date());
			return String(a ?? "").slice(0, 10) === e;
		}
		case "isPast": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = ft(/* @__PURE__ */ new Date());
			return String(a ?? "").slice(0, 10) < e;
		}
		case "isFuture": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = ft(/* @__PURE__ */ new Date());
			return String(a ?? "").slice(0, 10) > e;
		}
		case "withinPastDays": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = new Date(String(a)).getTime();
			if (isNaN(e)) return !1;
			let t = /* @__PURE__ */ new Date();
			t.setHours(0, 0, 0, 0);
			let n = Math.floor((t.getTime() - e) / 864e5);
			return n >= 0 && n <= Number(i);
		}
		case "withinNextDays": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = new Date(String(a)).getTime();
			if (isNaN(e)) return !1;
			let t = /* @__PURE__ */ new Date();
			t.setHours(0, 0, 0, 0);
			let n = Math.floor((e - t.getTime()) / 864e5);
			return n >= 0 && n <= Number(i);
		}
		default: return !1;
	}
}
function Ze(e, t, n) {
	if (!t.length) return e;
	let r = [], i = [];
	for (let e of t) e.conjunction === "or" && i.length > 0 ? (r.push(i), i = [e]) : i.push(e);
	return i.length > 0 && r.push(i), e.filter((e) => r.some((t) => t.every((t) => {
		let r = Ye(n, t.fieldId);
		return !r || Xe(r.getValue(e), t.operator, t.value, r.type);
	})));
}
function Qe(e, t, n) {
	if (!t.length) return e;
	let r = t.flatMap((e) => {
		let t = Ye(n, e.fieldId);
		return t?.sortable ? [{
			rule: e,
			field: t
		}] : [];
	});
	return r.length ? e.map((e, t) => ({
		row: e,
		index: t
	})).sort((e, t) => {
		for (let { rule: n, field: i } of r) {
			let r = i.getValue(e.row), a = i.getValue(t.row), o = r == null || r === "", s = a == null || a === "";
			if (o || s) {
				if (o && s) continue;
				return o ? 1 : -1;
			}
			let c = pt(r, a, i, e.row, t.row);
			if (c !== 0) return n.direction === "desc" ? -c : c;
		}
		return e.index - t.index;
	}).map(({ row: e }) => e) : e;
}
var $e = Y.t("aiTable.engine.ungroupedLabel");
function et(e, t, n, r) {
	if (!t.length) return [];
	let i = Math.min(t.length, 2);
	function a(e, o, s) {
		if (o >= i) return [];
		let c = t[o], l = Ye(n, c.fieldId);
		if (!l) return [];
		let u = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = l.getValue(t), n = e == null || e === "" ? "__ungrouped__" : String(e);
			u.has(n) || u.set(n, []), u.get(n).push(t);
		}
		return Array.from(u.keys()).sort((e, t) => {
			if (e === "__ungrouped__") return 1;
			if (t === "__ungrouped__") return -1;
			let n = e.localeCompare(t, "zh-CN", { numeric: !0 });
			return c.direction === "desc" ? -n : n;
		}).map((e) => {
			let t = u.get(e), n = t[0], d = e === "__ungrouped__" ? $e : l.formatValue?.(l.getValue(n), n) ?? e, f = `${s}${s ? ":" : ""}${c.fieldId}=${e}`, p = r.includes(f), m = {
				key: f,
				label: d,
				count: t.length,
				depth: o,
				collapsed: p,
				rows: t
			};
			if (o + 1 < i) {
				let e = a(t, o + 1, f);
				e.length > 0 && (m.children = e);
			}
			return m;
		});
	}
	return a(e, 0, "");
}
function tt(e) {
	let t = [], n = [];
	function r(e) {
		for (let i of e) t.push({
			group: i,
			isHeader: !0
		}), i.collapsed || (i.children && i.children.length > 0 ? r(i.children) : n.push(...i.rows));
	}
	return r(e), {
		groupHeaders: t,
		rows: n
	};
}
function nt(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a;
	for (let o of t) {
		let t = Ye(n, o.fieldId);
		t && Xe(t.getValue(e), o.operator, o.value, t.type) && (o.scope === "cell" ? r.has(o.fieldId) || r.set(o.fieldId, o.colorToken) : o.scope === "row" ? i ||= o.colorToken : o.scope === "rowMarker" && !a && (a = o.colorToken));
	}
	return {
		rowColor: i,
		rowMarkerColor: a,
		cellColors: r
	};
}
function rt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n.scope === "column" && !t.has(n.fieldId) && t.set(n.fieldId, n.colorToken);
	return t;
}
function it(e, t) {
	if (t <= 1) return 0;
	let n = t - 1;
	return Math.min(Math.max(e, 1), n);
}
function at(e, t) {
	return JSON.stringify(e) !== JSON.stringify(t);
}
function ot(e, t, n, r) {
	return {
		rowKey: t,
		source: e,
		derivedValues: { ...n },
		aiValues: { ...r }
	};
}
function st(e, t) {
	let n = ze();
	if (!e) return n;
	let r = (e.aiFields ?? []).map((e) => ({
		...e,
		autoUpdate: e.autoUpdate ?? !1,
		allowEmptyReferencedValues: e.allowEmptyReferencedValues ?? !1
	})), i = /* @__PURE__ */ new Set([...t.map((e) => e.fieldId), ...r.map((e) => e.fieldId)]), a = /* @__PURE__ */ new Set([...t.filter((e) => e.sortable).map((e) => e.fieldId), ...r.map((e) => e.fieldId)]);
	return {
		filters: (e.filters ?? []).filter((e) => i.has(e.fieldId)),
		groups: (e.groups ?? []).filter((e) => i.has(e.fieldId)),
		sorts: (e.sorts ?? []).filter((e) => a.has(e.fieldId)),
		collapsedGroupKeys: e.collapsedGroupKeys ?? [],
		colorRules: (e.colorRules ?? []).filter((e) => i.has(e.fieldId)),
		aiFields: r,
		frozenColumnCount: e.frozenColumnCount ?? 0
	};
}
function X(e = "rule") {
	return dt += 1, `${e}_${Date.now().toString(36)}_${dt.toString(36)}`;
}
function ct(e) {
	return e.length ? Y.t("aiTable.engine.filterSummary", { count: e.length }) : null;
}
function lt(e) {
	return e.length ? Y.t("aiTable.engine.groupSummary", { count: e.length }) : null;
}
function ut(e, t) {
	if (!e.length) return null;
	if (e.length > 1) return Y.t("aiTable.engine.sortSummary", { count: e.length });
	let n = Ye(t, e[0].fieldId);
	return n ? Y.t("aiTable.engine.sortSummaryByField", { field: n.label.replace("（Demo派生）", "") }) : Y.t("aiTable.engine.sortDefault");
}
var dt = 0;
function ft(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function pt(e, t, n, r, i) {
	if (n.type === "number") {
		let n = Number(e), r = Number(t);
		if (!Number.isNaN(n) && !Number.isNaN(r)) return n - r;
	}
	if (n.type === "date" || n.type === "datetime") {
		let n = new Date(String(e)).getTime(), r = new Date(String(t)).getTime();
		if (!Number.isNaN(n) && !Number.isNaN(r)) return n - r;
	}
	let a = n.formatValue?.(e, r) ?? String(e), o = n.formatValue?.(t, i) ?? String(t);
	return a.localeCompare(o, "zh-CN", {
		numeric: !0,
		sensitivity: "base"
	});
}
function mt(e) {
	return e.length ? Y.t("aiTable.engine.colorSummary", { count: e.length }) : null;
}
//#endregion
//#region src/components/ai-table/ai-table-storage.ts
var ht = "ai-table-plugin:v1";
function gt(e) {
	return `${ht}:${e}:mode`;
}
function _t(e) {
	return `${ht}:${e}:view`;
}
function vt(e) {
	return `${ht}:${e}:ai-values`;
}
function yt(e, t = "classic") {
	if (typeof window > "u") return t;
	try {
		let n = window.localStorage.getItem(gt(e));
		return n === "smart" || n === "classic" ? n : t;
	} catch {
		return t;
	}
}
function bt(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(gt(e), t);
	} catch {}
}
function xt(e) {
	if (typeof window > "u") return null;
	try {
		let t = window.localStorage.getItem(_t(e));
		if (!t) return null;
		let n = JSON.parse(t);
		return {
			...ze(),
			...n
		};
	} catch {
		return null;
	}
}
function St(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(_t(e), JSON.stringify(t));
	} catch {}
}
function Ct(e) {
	if (typeof window > "u") return {};
	try {
		let t = window.localStorage.getItem(vt(e));
		if (!t) return {};
		let n = JSON.parse(t);
		return typeof n == "object" && n ? n : {};
	} catch {
		return {};
	}
}
function wt(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(vt(e), JSON.stringify(t));
	} catch {}
}
function Tt(e, t) {
	let n = Ct(e);
	return delete n[t], wt(e, n), n;
}
function Et(e, t, n, r) {
	let i = Ct(e);
	return i[t] || (i[t] = {}), i[t][n] = r, wt(e, i), i;
}
//#endregion
//#region src/components/ai-table/AITableShellContext.tsx
var Dt = e.createContext(null);
function Ot({ children: t }) {
	let [n, r] = e.useState(null), i = e.useCallback((e) => {
		r(e);
	}, []), a = e.useCallback((e) => {
		r((t) => t?.tableId === e ? null : t);
	}, []), o = e.useMemo(() => ({
		registration: n,
		publish: i,
		clear: a
	}), [
		a,
		i,
		n
	]);
	return /* @__PURE__ */ s(Dt.Provider, {
		value: o,
		children: t
	});
}
function kt(t) {
	let n = e.useContext(Dt), r = n?.publish, i = n?.clear;
	e.useLayoutEffect(() => {
		r?.(t);
	}, [r, t]), e.useEffect(() => () => i?.(t.tableId), [i, t.tableId]);
}
function At() {
	return e.useContext(Dt);
}
//#endregion
//#region src/components/ai-table/ai-field-generation.ts
function jt(e) {
	return e == null ? !0 : typeof e == "string" ? e.trim() === "" : Array.isArray(e) ? e.length === 0 : !1;
}
function Mt(e, t, n) {
	return e.allowEmptyReferencedValues ? [] : e.referencedFieldIds.filter((e) => {
		let r = n.find((t) => t.fieldId === e);
		return !r || jt(r.getValue(t));
	});
}
function Nt(e, t, n) {
	return Mt(e, t, n).length === 0;
}
function Pt(e, t, n) {
	let r = e.referencedFieldIds.map((e) => n.find((t) => t.fieldId === e));
	return JSON.stringify([e.allowEmptyReferencedValues, r.map((e) => e?.getValue(t) ?? null)]);
}
//#endregion
//#region src/components/ai-table/AITableProvider.tsx
var Ft = 3e3, It = e.createContext(null);
function Z() {
	let t = e.useContext(It);
	if (!t) throw Error("useAITable must be used within AITableProvider");
	return t;
}
function Lt({ config: t, rows: n, totalCount: r, onQueryChange: i, queryFieldIds: a, defaultMode: o = "classic", modeLock: c, children: l }) {
	let { tableId: u, fields: d, rowKey: f } = t, p = e.useMemo(() => a ? new Set(a) : null, [a]), m = e.useMemo(() => {
		let e = st(xt(u), d);
		return p ? {
			...e,
			filters: e.filters.filter((e) => p.has(e.fieldId)),
			sorts: e.sorts.filter((e) => p.has(e.fieldId))
		} : e;
	}, [
		d,
		p,
		u
	]), [h, g] = e.useState(() => c ?? yt(u, o)), [_, v] = e.useState("idle"), [y, b] = e.useState(m), [x, S] = e.useState(m), [C, w] = e.useState(null), [T, E] = e.useState("idle"), [D, O] = e.useState(() => Ct(u)), k = e.useRef(null), A = e.useRef(null), j = e.useRef(/* @__PURE__ */ new Map()), M = e.useRef(/* @__PURE__ */ new Set()), N = e.useMemo(() => at(y, x), [y, x]), P = e.useMemo(() => ({
		mode: h,
		modeTransition: _,
		savedView: y,
		draftView: x,
		activePanel: C,
		generationState: T,
		dirty: N
	}), [
		C,
		N,
		x,
		T,
		h,
		_,
		y
	]), F = e.useCallback((e) => {
		if (c) {
			A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(c), w(null);
			return;
		}
		if (w(null), e === "smart" && h === "classic") {
			if (A.current !== null) return;
			v("switching-to-smart"), A.current = setTimeout(() => {
				g("smart"), bt(u, "smart"), v("idle"), A.current = null;
			}, Ft);
			return;
		}
		A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(e), bt(u, e);
	}, [
		h,
		c,
		u
	]);
	e.useEffect(() => {
		c && (A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(c), w(null));
	}, [c]), e.useEffect(() => () => {
		A.current !== null && clearTimeout(A.current);
	}, []);
	let ee = e.useCallback((e) => {
		S((t) => ({
			...t,
			...e
		}));
	}, []), te = e.useCallback((e) => {
		let t = st({
			...y,
			sorts: p ? e.filter((e) => p.has(e.fieldId)) : e
		}, d);
		b(t), S((e) => ({
			...e,
			sorts: t.sorts
		})), St(u, t);
	}, [
		d,
		p,
		y,
		u
	]), ne = e.useCallback(() => {
		let e = st(x, d), t = p ? {
			...e,
			filters: e.filters.filter((e) => p.has(e.fieldId)),
			sorts: e.sorts.filter((e) => p.has(e.fieldId))
		} : e;
		b(t), S(t), St(u, t), O((e) => {
			let n = new Set(t.aiFields.map((e) => e.fieldId)), r = Object.fromEntries(Object.entries(e).filter(([e]) => n.has(e)));
			return wt(u, r), r;
		}), w(null);
	}, [
		x,
		d,
		p,
		u
	]), I = e.useCallback(() => {
		let e = st({
			...ze(),
			aiFields: y.aiFields
		}, d);
		b(e), S(e), St(u, e), w(null);
	}, [
		d,
		y.aiFields,
		u
	]), re = e.useCallback(() => {
		S(y), w(null);
	}, [y]), L = JSON.stringify([y.filters, y.sorts]);
	e.useEffect(() => {
		!i || k.current === L || (k.current = L, i({
			filters: y.filters,
			sorts: y.sorts
		}));
	}, [
		i,
		y.filters,
		y.sorts,
		L
	]), kt(e.useMemo(() => ({
		tableId: u,
		mode: h,
		modeTransition: _,
		dirty: N,
		setMode: F,
		cancelDraft: re
	}), [
		re,
		N,
		h,
		_,
		F,
		u
	]));
	let R = e.useCallback((e) => {
		let t = e.map((e) => ({
			fieldId: e.fieldId,
			label: e.name,
			type: e.outputType,
			source: "ai",
			getValue: (t) => D[e.fieldId]?.[f(t)],
			filterable: !0,
			groupable: !0,
			colorable: !0,
			sortable: !0,
			aiReadable: !0,
			formatValue: (e) => zt(e)
		}));
		return [...d, ...t];
	}, [
		D,
		d,
		f
	]), z = e.useMemo(() => R(y.aiFields), [R, y.aiFields]), ie = e.useMemo(() => R(x.aiFields), [R, x.aiFields]), B = e.useMemo(() => i ? n : Ze(n, y.filters, z), [
		z,
		i,
		n,
		y.filters
	]), ae = e.useMemo(() => i ? B : Qe(B, y.sorts, z), [
		z,
		B,
		i,
		y.sorts
	]), oe = e.useMemo(() => Rt(y.groups, x.groups) ? x.collapsedGroupKeys : y.collapsedGroupKeys, [
		x.collapsedGroupKeys,
		x.groups,
		y.collapsedGroupKeys,
		y.groups
	]), V = e.useMemo(() => et(ae, y.groups, z, oe), [
		z,
		oe,
		y.groups,
		ae
	]), se = e.useMemo(() => {
		if (!V.length) return ae;
		let e = [], t = (n) => {
			for (let r of n) r.collapsed || (r.children?.length ? t(r.children) : e.push(...r.rows));
		};
		return t(V), e;
	}, [V, ae]), ce = e.useMemo(() => n.map((e) => {
		let t = f(e);
		return {
			rowKey: t,
			source: e,
			derivedValues: Object.fromEntries(d.filter((e) => e.source === "derived").map((t) => [t.fieldId, t.getValue(e)])),
			aiValues: Object.fromEntries(y.aiFields.map((e) => [e.fieldId, D[e.fieldId]?.[t]]).filter(([, e]) => e !== void 0))
		};
	}), [
		D,
		d,
		f,
		n,
		y.aiFields
	]), { rowColors: le, rowMarkerColors: ue, cellColors: de, columnColors: H } = e.useMemo(() => {
		let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let r of B) {
			let i = f(r), a = nt(r, y.colorRules, z);
			a.rowColor && e.set(i, a.rowColor), a.rowMarkerColor && t.set(i, a.rowMarkerColor), a.cellColors.size && n.set(i, a.cellColors);
		}
		return {
			rowColors: e,
			rowMarkerColors: t,
			cellColors: n,
			columnColors: rt(y.colorRules)
		};
	}, [
		z,
		B,
		f,
		y.colorRules
	]), U = e.useCallback(async (e, n, r) => {
		let i = n.filter((t) => Nt(e, t, r)), a = n.filter((t) => !Nt(e, t, r)).map(f), o = i.length ? await t.aiAdapter.previewAIField({
			definition: e,
			rows: i,
			rowKey: f,
			fields: r
		}) : [];
		O((t) => {
			let n = {
				...t,
				[e.fieldId]: { ...t[e.fieldId] ?? {} }
			};
			for (let t of a) delete n[e.fieldId][t];
			for (let t of o) t.error || (n[e.fieldId][t.rowKey] = t.value);
			return wt(u, n), n;
		});
	}, [
		t.aiAdapter,
		f,
		u
	]), fe = e.useCallback(async (e) => {
		await U(e, B, ie);
		let t = {
			...x,
			aiFields: [...x.aiFields.filter((t) => t.fieldId !== e.fieldId), e]
		};
		S(t), b(t), St(u, t), w(null);
	}, [
		ie,
		x,
		U,
		B,
		u
	]), pe = e.useCallback(async (e) => {
		let t = x.aiFields.find((t) => t.fieldId === e);
		t && await U(t, B, ie);
	}, [
		ie,
		x.aiFields,
		U,
		B
	]);
	e.useEffect(() => {
		let e = y.aiFields.filter((e) => e.autoUpdate), t = new Set(e.map((e) => e.fieldId));
		for (let e of j.current.keys()) t.has(e) || j.current.delete(e);
		for (let t of e) {
			if (M.current.has(t.fieldId)) continue;
			let e = j.current.get(t.fieldId), r = new Map(n.map((e) => [f(e), Pt(t, e, z)])), i = n.filter((t) => {
				let n = f(t);
				return !e || e.get(n) !== r.get(n);
			});
			j.current.set(t.fieldId, r), i.length && (M.current.add(t.fieldId), U(t, i, z).catch(() => {
				E("error");
			}).finally(() => {
				M.current.delete(t.fieldId);
			}));
		}
	}, [
		D,
		z,
		U,
		f,
		n,
		y.aiFields
	]);
	let me = e.useCallback((e) => {
		S((t) => ({
			...t,
			aiFields: t.aiFields.filter((t) => t.fieldId !== e),
			filters: t.filters.filter((t) => t.fieldId !== e),
			groups: t.groups.filter((t) => t.fieldId !== e),
			sorts: t.sorts.filter((t) => t.fieldId !== e),
			colorRules: t.colorRules.filter((t) => t.fieldId !== e)
		})), O(Tt(u, e));
	}, [u]), he = {
		config: t,
		state: P,
		rows: n,
		totalCount: r,
		serverQuery: !!i,
		queryFieldIds: a,
		appliedFields: z,
		draftFields: ie,
		setMode: F,
		updateDraft: ee,
		updateSorts: te,
		saveView: ne,
		restoreDefaultView: I,
		cancelDraft: re,
		setActivePanel: w,
		setGenerationState: E,
		createAIField: fe,
		removeAIField: me,
		regenerateAIFieldValues: pe,
		projections: ce,
		filteredRows: B,
		sortedRows: ae,
		visibleRows: se,
		groups: V,
		rowColors: le,
		rowMarkerColors: ue,
		cellColors: de,
		columnColors: H,
		aiValues: D
	};
	return /* @__PURE__ */ s(It.Provider, {
		value: he,
		children: l
	});
}
function Rt(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function zt(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "HIGH" ? Y.t("aiTable.badge.highRisk") : t === "MEDIUM" ? Y.t("aiTable.badge.mediumRisk") : t === "LOW" ? Y.t("aiTable.badge.lowRisk") : t === "ATTENTION" ? Y.t("aiTable.badge.attention") : t === "NORMAL" ? Y.t("aiTable.badge.normal") : String(e ?? "");
}
//#endregion
//#region src/lib/utils.ts
function Q(...e) {
	return xe(be(e));
}
//#endregion
//#region src/components/ui/button.tsx
var Bt = de("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function $({ className: e, variant: t = "default", size: n = "default", asChild: r = !1, ...i }) {
	return /* @__PURE__ */ s(r ? _e.Root : "button", {
		"data-slot": "button",
		"data-variant": t,
		"data-size": n,
		className: Q(Bt({
			variant: t,
			size: n,
			className: e
		})),
		...i
	});
}
//#endregion
//#region src/lib/overlay-hide-guard.ts
function Vt(e, t) {
	let r = i(e);
	r.current = e;
	let a = i(t);
	a.current = t, n(() => {
		let e = !1, t = window.setTimeout(() => {
			e = !0;
		}, 0);
		return () => {
			window.clearTimeout(t), e && r.current && a.current?.(!1);
		};
	}, []);
}
//#endregion
//#region src/components/ui/alert-dialog.tsx
function Ht({ ...e }) {
	return Vt(e.open, e.onOpenChange), /* @__PURE__ */ s(H.Root, {
		"data-slot": "alert-dialog",
		...e
	});
}
function Ut({ ...e }) {
	return /* @__PURE__ */ s(H.Portal, {
		"data-slot": "alert-dialog-portal",
		...e
	});
}
function Wt({ className: e, ...t }) {
	return /* @__PURE__ */ s(H.Overlay, {
		"data-slot": "alert-dialog-overlay",
		className: Q("fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", e),
		...t
	});
}
function Gt({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ s(Ut, { children: /* @__PURE__ */ c("div", {
		className: "ai-table-plugin",
		children: [/* @__PURE__ */ s(Wt, {}), /* @__PURE__ */ s(H.Content, {
			"data-slot": "alert-dialog-content",
			"data-size": t,
			className: Q("group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
			...n
		})]
	}) });
}
function Kt({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "alert-dialog-header",
		className: Q("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]", e),
		...t
	});
}
function qt({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "alert-dialog-footer",
		className: Q("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end", e),
		...t
	});
}
function Jt({ className: e, ...t }) {
	return /* @__PURE__ */ s(H.Title, {
		"data-slot": "alert-dialog-title",
		className: Q("font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", e),
		...t
	});
}
function Yt({ className: e, ...t }) {
	return /* @__PURE__ */ s(H.Description, {
		"data-slot": "alert-dialog-description",
		className: Q("text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", e),
		...t
	});
}
function Xt({ className: e, variant: t = "default", size: n = "default", ...r }) {
	return /* @__PURE__ */ s($, {
		variant: t,
		size: n,
		asChild: !0,
		children: /* @__PURE__ */ s(H.Action, {
			"data-slot": "alert-dialog-action",
			className: Q(e),
			...r
		})
	});
}
function Zt({ className: e, variant: t = "outline", size: n = "default", ...r }) {
	return /* @__PURE__ */ s($, {
		variant: t,
		size: n,
		asChild: !0,
		children: /* @__PURE__ */ s(H.Cancel, {
			"data-slot": "alert-dialog-cancel",
			className: Q(e),
			...r
		})
	});
}
//#endregion
//#region src/components/ai-table/AITableModeSwitch.tsx
function Qt({ mode: t, modeTransition: n, dirty: r, setMode: i, cancelDraft: a }) {
	let { t: l } = J(), [u, d] = e.useState(!1), [f, p] = e.useState(null);
	function m(e) {
		if (e !== t) {
			if (r && t === "smart" && e === "classic") {
				p(e), d(!0);
				return;
			}
			i(e);
		}
	}
	function h() {
		f && (a(), i(f)), d(!1), p(null);
	}
	function g() {
		d(!1), p(null);
	}
	let _ = t === "smart", v = n === "switching-to-smart", y = _ ? "classic" : "smart";
	return /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ c($, {
		type: "button",
		variant: _ ? "default" : "outline",
		size: "sm",
		className: Q("h-8 gap-1.5 px-2.5 text-xs font-medium shadow-none xl:px-3", _ ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary/30 bg-primary/5 text-primary hover:border-primary/45 hover:bg-primary/10 hover:text-primary"),
		"aria-pressed": _,
		"aria-busy": v,
		"aria-label": l(v ? "aiTable.modeSwitch.switchingToSmart" : _ ? "aiTable.modeSwitch.backToClassic" : "aiTable.modeSwitch.switchToSmart"),
		disabled: v,
		onClick: () => m(y),
		children: [
			v ? /* @__PURE__ */ s(ee, { className: "size-3.5 animate-spin" }) : s(_ ? ie : z, { className: "size-3.5" }),
			/* @__PURE__ */ s("span", {
				className: "hidden xl:inline",
				children: l(v ? "aiTable.modeSwitch.switching" : _ ? "aiTable.modeSwitch.backToClassic" : "aiTable.modeSwitch.switchToSmart")
			}),
			/* @__PURE__ */ s("span", {
				className: "xl:hidden",
				children: l("aiTable.modeSwitch.aiTable")
			})
		]
	}), /* @__PURE__ */ s(Ht, {
		open: u,
		onOpenChange: d,
		children: /* @__PURE__ */ c(Gt, { children: [/* @__PURE__ */ c(Kt, { children: [/* @__PURE__ */ s(Jt, { children: l("aiTable.modeSwitch.discardTitle") }), /* @__PURE__ */ s(Yt, { children: l("aiTable.modeSwitch.discardDescription") })] }), /* @__PURE__ */ c(qt, { children: [/* @__PURE__ */ s(Zt, {
			onClick: g,
			children: l("aiTable.modeSwitch.cancel")
		}), /* @__PURE__ */ s(Xt, {
			onClick: h,
			children: l("aiTable.modeSwitch.discardAndSwitch")
		})] })] })
	})] });
}
function $t() {
	let { state: e, setMode: t, cancelDraft: n } = Z();
	return /* @__PURE__ */ s(Qt, {
		mode: e.mode,
		modeTransition: e.modeTransition,
		dirty: e.dirty,
		setMode: t,
		cancelDraft: n
	});
}
//#endregion
//#region src/components/ai-table/SmartTableSwitchingLoader.tsx
var en = [
	{
		key: "allDocuments",
		type: "primary"
	},
	{
		key: "exceptionView",
		type: "green"
	},
	{
		key: "groupBySupplier",
		type: ""
	},
	{
		key: "arrivalTimeout",
		type: "orange"
	},
	{
		key: "quantityDiff",
		type: ""
	}
], tn = [
	{
		highlight: !0,
		order: "line-lg",
		upstream: "line-md",
		type: "line-sm",
		status: "line-sm",
		supplier: "line-xl",
		quantity: "line-sm",
		time: "line-lg",
		ai: "line-70"
	},
	{
		highlight: !1,
		order: "line-xl",
		upstream: "line-sm",
		type: "line-md",
		status: "line-sm",
		supplier: "line-lg",
		quantity: "line-sm",
		time: "line-xl",
		ai: "line-52"
	},
	{
		highlight: !0,
		order: "line-lg",
		upstream: "line-md",
		type: "line-sm",
		status: "line-md",
		supplier: "line-xl",
		quantity: "line-xs",
		time: "line-lg",
		ai: "line-70"
	},
	{
		highlight: !1,
		order: "line-xl",
		upstream: "line-sm",
		type: "line-md",
		status: "line-sm",
		supplier: "line-lg",
		quantity: "line-sm",
		time: "line-xl",
		ai: "line-52"
	}
], nn = [{
	highlight: !0,
	order: "line-lg",
	upstream: "line-md",
	type: "line-sm",
	status: "line-sm",
	supplier: "line-xl",
	quantity: "line-sm",
	time: "line-lg",
	ai: "line-70"
}, {
	highlight: !1,
	order: "line-xl",
	upstream: "line-sm",
	type: "line-md",
	status: "line-sm",
	supplier: "line-lg",
	quantity: "line-sm",
	time: "line-xl",
	ai: "line-52"
}], rn = [
	"capabilityUnderstanding",
	"capabilityFiltering",
	"capabilityGrouping",
	"capabilityView"
];
function an({ highlight: e, order: t, upstream: n, type: r, status: i, supplier: a, quantity: o, time: l, ai: u }) {
	return /* @__PURE__ */ c("tr", {
		className: e ? "smart-table-ai-highlight" : void 0,
		children: [
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: "smart-table-mini-checkbox" }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${t}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${n}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${r}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${i}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${a}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${o}` }) }),
			/* @__PURE__ */ s("td", { children: /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${l}` }) }),
			/* @__PURE__ */ s("td", {
				className: "smart-table-ai-column-cell",
				children: /* @__PURE__ */ c("div", {
					className: "smart-table-cell-flex",
					children: [/* @__PURE__ */ s("span", {
						className: "smart-table-mini-ai-spark",
						children: "AI"
					}), /* @__PURE__ */ s("span", { className: `smart-table-skeleton-line ${u}` })]
				})
			})
		]
	});
}
function on({ title: e, subtitle: t, statusText: n, askText: r, className: i = "" }) {
	let { t: a } = J(), o = e ?? a("aiTable.loader.title"), l = t ?? a("aiTable.loader.subtitle"), u = n ?? a("aiTable.loader.statusText"), d = r ?? a("aiTable.loader.askText");
	return /* @__PURE__ */ s("section", {
		className: `smart-table-loader-card ${i}`,
		children: /* @__PURE__ */ c("div", {
			className: "smart-table-loader-inner",
			children: [
				/* @__PURE__ */ s("div", { className: "smart-table-bg" }),
				/* @__PURE__ */ s("div", { className: "smart-table-shimmer" }),
				/* @__PURE__ */ c("div", {
					className: "smart-table-content",
					children: [
						/* @__PURE__ */ c("header", {
							className: "smart-table-loader-header",
							children: [/* @__PURE__ */ c("div", {
								className: "smart-table-loader-title-group",
								children: [/* @__PURE__ */ s("div", {
									className: "smart-table-ai-mark",
									children: "AI"
								}), /* @__PURE__ */ c("div", {
									className: "smart-table-loader-copy",
									children: [/* @__PURE__ */ c("div", {
										className: "smart-table-loader-title",
										children: [o, /* @__PURE__ */ s("span", { className: "smart-table-dots" })]
									}), /* @__PURE__ */ s("div", {
										className: "smart-table-loader-subtitle",
										children: l
									})]
								})]
							}), /* @__PURE__ */ c("div", {
								className: "smart-table-status-pill",
								children: [/* @__PURE__ */ s("span", { className: "smart-table-status-dot" }), u]
							})]
						}),
						/* @__PURE__ */ c("section", {
							className: "smart-table-toolbar",
							children: [/* @__PURE__ */ c("div", {
								className: "smart-table-ask-row",
								children: [
									/* @__PURE__ */ c("div", {
										className: "smart-table-ask-input",
										children: [/* @__PURE__ */ s("span", { className: "smart-table-ask-prefix-dot" }), /* @__PURE__ */ s("span", {
											className: "smart-table-ask-text",
											children: d
										})]
									}),
									/* @__PURE__ */ s("div", {
										className: "smart-table-toolbar-btn secondary",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ s("div", {
										className: "smart-table-toolbar-btn",
										"aria-hidden": "true"
									})
								]
							}), /* @__PURE__ */ c("div", {
								className: "smart-table-view-row",
								children: [/* @__PURE__ */ s("span", {
									className: "smart-table-view-label",
									children: a("aiTable.loader.smartView")
								}), en.map((e) => /* @__PURE__ */ c("span", {
									className: `smart-table-view-chip ${e.type}`,
									children: [/* @__PURE__ */ s("span", { className: "smart-table-view-dot" }), a(`aiTable.loader.${e.key}`)]
								}, e.key))]
							})]
						}),
						/* @__PURE__ */ c("section", {
							className: "smart-table-shell",
							children: [
								/* @__PURE__ */ c("div", {
									className: "smart-table-topbar",
									children: [/* @__PURE__ */ c("div", {
										className: "smart-table-topbar-left",
										children: [
											/* @__PURE__ */ s("span", { className: "smart-table-mini-checkbox" }),
											/* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-md" }),
											/* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" })
										]
									}), /* @__PURE__ */ c("div", {
										className: "smart-table-topbar-right",
										children: [
											/* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" }),
											/* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-md" }),
											/* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-xs" })
										]
									})]
								}),
								/* @__PURE__ */ c("table", {
									className: "smart-table-skeleton",
									"aria-label": "smart table switching skeleton",
									children: [
										/* @__PURE__ */ c("colgroup", { children: [
											/* @__PURE__ */ s("col", { style: { width: 46 } }),
											/* @__PURE__ */ s("col", { style: { width: "15%" } }),
											/* @__PURE__ */ s("col", { style: { width: "13%" } }),
											/* @__PURE__ */ s("col", { style: { width: "11%" } }),
											/* @__PURE__ */ s("col", { style: { width: "11%" } }),
											/* @__PURE__ */ s("col", { style: { width: "14%" } }),
											/* @__PURE__ */ s("col", { style: { width: "12%" } }),
											/* @__PURE__ */ s("col", { style: { width: "15%" } }),
											/* @__PURE__ */ s("col", { style: { width: "13%" } })
										] }),
										/* @__PURE__ */ s("thead", { children: /* @__PURE__ */ c("tr", { children: [
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-mini-checkbox" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ s("th", { children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ s("th", {
												className: "smart-table-ai-column",
												children: /* @__PURE__ */ s("span", { className: "smart-table-skeleton-line line-sm" })
											})
										] }) }),
										/* @__PURE__ */ c("tbody", { children: [
											/* @__PURE__ */ s("tr", {
												className: "smart-table-group-row",
												children: /* @__PURE__ */ s("td", {
													colSpan: 9,
													children: /* @__PURE__ */ c("div", {
														className: "smart-table-group-label",
														children: [
															/* @__PURE__ */ s("span", { className: "smart-table-group-label-dot" }),
															a("aiTable.loader.creatingGroup"),
															/* @__PURE__ */ s("span", { className: "smart-table-group-line" })
														]
													})
												})
											}),
											tn.map((e, t) => /* @__PURE__ */ s(an, { ...e }, t)),
											/* @__PURE__ */ s("tr", {
												className: "smart-table-group-row",
												children: /* @__PURE__ */ s("td", {
													colSpan: 9,
													children: /* @__PURE__ */ c("div", {
														className: "smart-table-group-label",
														children: [
															/* @__PURE__ */ s("span", { className: "smart-table-group-label-dot" }),
															a("aiTable.loader.generatingView"),
															/* @__PURE__ */ s("span", { className: "smart-table-group-line" })
														]
													})
												})
											}),
											nn.map((e, t) => /* @__PURE__ */ s(an, { ...e }, `second-${t}`))
										] })
									]
								}),
								/* @__PURE__ */ c("div", {
									className: "smart-table-footer-status",
									children: [/* @__PURE__ */ s("div", {
										className: "smart-table-capability-chips",
										children: rn.map((e) => /* @__PURE__ */ c("span", {
											className: "smart-table-capability-chip",
											children: [/* @__PURE__ */ s("span", { className: "smart-table-capability-dot" }), a(`aiTable.loader.${e}`)]
										}, e))
									}), /* @__PURE__ */ c("div", {
										className: "smart-table-progress-group",
										children: [/* @__PURE__ */ s("span", {
											className: "smart-table-progress-text",
											children: "Upgrading table"
										}), /* @__PURE__ */ s("span", { className: "smart-table-mini-progress" })]
									})]
								})
							]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/ai-table/AITableGlobalModeSwitch.tsx
function sn() {
	let e = At()?.registration;
	return e ? /* @__PURE__ */ s(Qt, {
		mode: e.mode,
		modeTransition: e.modeTransition,
		dirty: e.dirty,
		setMode: e.setMode,
		cancelDraft: e.cancelDraft
	}) : null;
}
//#endregion
//#region src/components/ai-table/AITableVisibility.tsx
function cn({ children: e }) {
	let { state: t } = Z();
	return t.mode === "classic" && t.modeTransition === "idle" ? /* @__PURE__ */ s(o, { children: e }) : null;
}
function ln({ title: e, actions: t }) {
	return /* @__PURE__ */ c("div", {
		className: "flex min-h-10 items-center justify-between gap-4",
		children: [/* @__PURE__ */ s("h1", {
			className: "text-lg font-semibold",
			children: e
		}), t]
	});
}
//#endregion
//#region src/components/ui/popover.tsx
var un = null;
function dn({ ...e }) {
	return /* @__PURE__ */ s(he.Root, {
		"data-slot": "popover",
		...e
	});
}
function fn({ onClick: e, onPointerDown: t, onKeyDown: n, ...r }) {
	function i(e) {
		un = e.currentTarget;
	}
	return /* @__PURE__ */ s(he.Trigger, {
		"data-slot": "popover-trigger",
		...r,
		onPointerDown: (e) => {
			i(e), t?.(e);
		},
		onClick: (t) => {
			i(t), e?.(t);
		},
		onKeyDown: (e) => {
			i(e), n?.(e);
		}
	});
}
function pn({ className: t, align: n = "center", sideOffset: r = 4, style: i, ...a }) {
	let o = e.useRef(null), [c, l] = e.useState(null), u = a.side ?? "bottom";
	e.useLayoutEffect(() => {
		let e = () => {
			let e = un, t = o.current;
			if (!e || !t) return;
			let i = e.getBoundingClientRect(), a = t.getBoundingClientRect(), s = r, c = window.innerWidth, d = window.innerHeight, f = Math.max(120, d - i.bottom - s - 8), p = Math.max(120, i.top - s - 8), m = u === "bottom" && (f >= Math.min(t.scrollHeight, 320) || f >= p), h = m ? f : p, g = m ? i.bottom + s : i.top - Math.min(t.scrollHeight, h) - s, _ = n === "end" ? i.right - a.width : n === "center" ? i.left + (i.width - a.width) / 2 : i.left, v = Math.min(Math.max(8, _), Math.max(8, c - a.width - 8));
			l({
				top: Math.max(8, Math.min(g, d - Math.min(a.height, h) - 8)),
				left: v,
				availableHeight: h
			});
		};
		e();
		let t = o.current ? new ResizeObserver(e) : null;
		o.current && t?.observe(o.current);
		let i = (t) => {
			let n = t.target;
			n instanceof Node && o.current?.contains(n) || e();
		};
		return window.addEventListener("resize", e), window.addEventListener("scroll", i, !0), () => {
			t?.disconnect(), window.removeEventListener("resize", e), window.removeEventListener("scroll", i, !0);
		};
	}, [
		n,
		u,
		r
	]);
	let d = un?.getBoundingClientRect(), f = d ? {
		top: d.bottom + r,
		left: d.left,
		availableHeight: Math.max(120, window.innerHeight - d.bottom - r - 8)
	} : {
		top: 120,
		left: 80,
		availableHeight: Math.max(120, typeof window > "u" ? 680 : window.innerHeight - 128)
	};
	return /* @__PURE__ */ s(he.Portal, {
		container: typeof document > "u" ? void 0 : document.body,
		children: /* @__PURE__ */ s("div", {
			className: "ai-table-plugin",
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 2147483e3,
				pointerEvents: "none"
			},
			children: /* @__PURE__ */ s(he.Content, {
				ref: o,
				"data-slot": "popover-content",
				align: n,
				sideOffset: r,
				style: {
					...i,
					position: "fixed",
					top: c?.top ?? f.top,
					left: c?.left ?? f.left,
					maxHeight: c?.availableHeight ?? f.availableHeight,
					"--radix-popover-content-available-height": `${c?.availableHeight ?? f.availableHeight}px`,
					transform: "none",
					zIndex: 2147483e3,
					pointerEvents: "auto"
				},
				className: Q("z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", t),
				...a
			})
		})
	});
}
//#endregion
//#region src/components/ui/select.tsx
function mn({ ...e }) {
	return /* @__PURE__ */ s(W.Root, {
		"data-slot": "select",
		...e
	});
}
function hn({ ...e }) {
	return /* @__PURE__ */ s(W.Group, {
		"data-slot": "select-group",
		...e
	});
}
function gn({ ...e }) {
	return /* @__PURE__ */ s(W.Value, {
		"data-slot": "select-value",
		...e
	});
}
function _n({ className: e, size: t = "default", children: n, ...r }) {
	return /* @__PURE__ */ c(W.Trigger, {
		"data-slot": "select-trigger",
		"data-size": t,
		className: Q("flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none", "data-[size=default]:h-9 data-[size=sm]:h-8", "data-[placeholder]:text-muted-foreground", "disabled:cursor-not-allowed disabled:opacity-50", "dark:bg-input/30 dark:hover:bg-input/50", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", e),
		...r,
		children: [n, /* @__PURE__ */ s(W.Icon, {
			asChild: !0,
			children: /* @__PURE__ */ s(v, { className: "size-4 opacity-50" })
		})]
	});
}
function vn({ className: e, children: t, position: n = "popper", align: r = "center", ...i }) {
	return /* @__PURE__ */ s(o, { children: /* @__PURE__ */ c(W.Content, {
		"data-slot": "select-content",
		className: Q("relative z-50 max-h-[min(14rem,var(--radix-select-content-available-height))] min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", n === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", e),
		position: n,
		align: r,
		...i,
		children: [
			/* @__PURE__ */ s(bn, {}),
			/* @__PURE__ */ s(W.Viewport, {
				className: Q("p-1", n === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
				children: t
			}),
			/* @__PURE__ */ s(xn, {})
		]
	}) });
}
function yn({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ c(W.Item, {
		"data-slot": "select-item",
		className: Q("relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden", "focus:bg-accent focus:text-accent-foreground", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", e),
		...n,
		children: [/* @__PURE__ */ s("span", {
			"data-slot": "select-item-indicator",
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ s(W.ItemIndicator, { children: /* @__PURE__ */ s(g, { className: "size-4" }) })
		}), /* @__PURE__ */ s(W.ItemText, { children: t })]
	});
}
function bn({ className: e, ...t }) {
	return /* @__PURE__ */ s(W.ScrollUpButton, {
		"data-slot": "select-scroll-up-button",
		className: Q("flex cursor-default items-center justify-center py-1", e),
		...t,
		children: /* @__PURE__ */ s(x, { className: "size-4" })
	});
}
function xn({ className: e, ...t }) {
	return /* @__PURE__ */ s(W.ScrollDownButton, {
		"data-slot": "select-scroll-down-button",
		className: Q("flex cursor-default items-center justify-center py-1", e),
		...t,
		children: /* @__PURE__ */ s(v, { className: "size-4" })
	});
}
//#endregion
//#region src/components/ai-table/FieldTypeIcon.tsx
var Sn = {
	text: {
		icon: se,
		label: "Text",
		color: "text-muted-foreground"
	},
	number: {
		icon: j,
		label: "Number",
		color: "text-blue-500"
	},
	tag: {
		icon: B,
		label: "Tag",
		color: "text-purple-500"
	},
	date: {
		icon: p,
		label: "Date",
		color: "text-green-500"
	},
	datetime: {
		icon: E,
		label: "DateTime",
		color: "text-green-500"
	}
};
function Cn({ type: e, className: t, showLabel: n = !1 }) {
	let r = Sn[e], i = r.icon;
	return /* @__PURE__ */ c("span", {
		className: Q("inline-flex items-center gap-1", t),
		children: [/* @__PURE__ */ s(i, { className: Q("size-3.5 shrink-0", r.color) }), n && /* @__PURE__ */ s("span", {
			className: Q("text-[10px] font-medium", r.color),
			children: r.label
		})]
	});
}
function wn({ fieldId: e, label: t, type: n, disabled: r }) {
	return /* @__PURE__ */ s(yn, {
		value: e,
		disabled: r,
		children: /* @__PURE__ */ c("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ s(Cn, { type: n }), /* @__PURE__ */ s("span", { children: t })]
		})
	}, e);
}
//#endregion
//#region src/assets/ai-prompt-rabbit.png?inline
var Tn = "data:image/png;base64,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";
//#endregion
//#region src/components/ui/input.tsx
function En({ className: e, type: t, ...n }) {
	return /* @__PURE__ */ s("input", {
		type: t,
		"data-slot": "input",
		className: Q("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm", "selection:bg-primary selection:text-primary-foreground", "placeholder:text-muted-foreground", "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground", "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", "dark:bg-input/30", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", e),
		...n
	});
}
//#endregion
//#region src/components/ai-table/AITablePanelParts.tsx
function Dn({ title: e, actions: t }) {
	return /* @__PURE__ */ c("div", {
		className: "flex items-center justify-between border-b px-4 py-3",
		children: [/* @__PURE__ */ c("div", {
			className: "flex items-center gap-1.5 text-sm font-semibold",
			children: [e, /* @__PURE__ */ s(M, { className: "size-3.5 text-muted-foreground" })]
		}), t]
	});
}
function On({ value: e, onChange: t, onSubmit: n, placeholder: r, loading: i, disabled: a }) {
	let { t: o } = J();
	return /* @__PURE__ */ c("div", {
		className: Q("flex items-center gap-2 rounded-lg border bg-card px-2 shadow-sm transition-colors", i && "bg-muted/30"),
		children: [
			/* @__PURE__ */ s("span", {
				className: "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md",
				children: /* @__PURE__ */ s("img", {
					src: Tn,
					alt: "",
					"aria-hidden": "true",
					className: "size-full object-cover"
				})
			}),
			/* @__PURE__ */ s(En, {
				value: e,
				onChange: (e) => t(e.target.value),
				onKeyDown: (e) => {
					e.key === "Enter" && !e.nativeEvent.isComposing && n();
				},
				placeholder: r,
				disabled: i || a,
				className: "h-10 flex-1 border-0 px-0 text-sm shadow-none focus:!shadow-none focus-visible:!shadow-none focus-visible:!ring-0"
			}),
			e ? /* @__PURE__ */ s($, {
				type: "button",
				size: "sm",
				className: "h-7 px-3 text-xs",
				disabled: i || a,
				onClick: n,
				children: o(i ? "aiTable.panelParts.generating" : "aiTable.panelParts.generate")
			}) : null
		]
	});
}
function kn({ primaryLabel: e }) {
	let { t } = J(), { saveView: n, cancelDraft: r } = Z();
	return /* @__PURE__ */ c("div", {
		className: "flex items-center justify-end gap-2 border-t px-4 py-3",
		children: [/* @__PURE__ */ s($, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: r,
			children: t("aiTable.panelParts.cancel")
		}), /* @__PURE__ */ s($, {
			type: "button",
			size: "sm",
			onClick: n,
			children: e ?? t("aiTable.panelParts.save")
		})]
	});
}
//#endregion
//#region src/components/ai-table/AITableValueEditor.tsx
function An({ field: e, operator: t, value: n, onChange: r, className: i }) {
	let { t: a } = J();
	if (!e || [
		"isEmpty",
		"notEmpty",
		"isToday",
		"isPast",
		"isFuture"
	].includes(t)) return /* @__PURE__ */ s("div", { className: i });
	if (e.options?.length) return /* @__PURE__ */ c(mn, {
		value: e.options.some((e) => String(e.value) === String(n)) ? String(n) : void 0,
		onValueChange: (t) => {
			let n = e.options?.find((e) => String(e.value) === t);
			r(n?.value ?? t);
		},
		children: [/* @__PURE__ */ s(_n, {
			className: i,
			children: /* @__PURE__ */ s(gn, { placeholder: a("aiTable.valueEditor.selectPlaceholder") })
		}), /* @__PURE__ */ s(vn, { children: e.options.map((e) => /* @__PURE__ */ s(yn, {
			value: String(e.value),
			children: e.label
		}, String(e.value))) })]
	});
	if (t === "withinPastDays" || t === "withinNextDays") return /* @__PURE__ */ s(En, {
		className: i,
		type: "number",
		inputMode: "decimal",
		min: 0,
		placeholder: "7",
		value: String(n ?? ""),
		onChange: (e) => r(e.target.value === "" ? "" : Number(e.target.value))
	});
	if (t === "between") {
		let t = Array.isArray(n) ? n : ["", ""], o = e.type === "number" ? "number" : e.type === "datetime" ? "datetime-local" : "date";
		return /* @__PURE__ */ c("div", {
			className: `flex min-w-0 items-center gap-1.5 ${i ?? ""}`,
			children: [
				/* @__PURE__ */ s(En, {
					className: "min-w-0 flex-1",
					type: o,
					value: String(t[0] ?? ""),
					onChange: (n) => r([jn(e.type, n.target.value), t[1] ?? ""]),
					"aria-label": a("aiTable.valueEditor.rangeStart")
				}),
				/* @__PURE__ */ s("span", {
					className: "shrink-0 text-xs text-muted-foreground",
					children: a("aiTable.valueEditor.rangeTo")
				}),
				/* @__PURE__ */ s(En, {
					className: "min-w-0 flex-1",
					type: o,
					value: String(t[1] ?? ""),
					onChange: (n) => r([t[0] ?? "", jn(e.type, n.target.value)]),
					"aria-label": a("aiTable.valueEditor.rangeEnd")
				})
			]
		});
	}
	return /* @__PURE__ */ s(En, {
		className: i,
		type: e.type === "number" ? "number" : e.type === "date" ? "date" : e.type === "datetime" ? "datetime-local" : "text",
		inputMode: e.type === "number" ? "decimal" : void 0,
		placeholder: e.type === "text" || e.type === "tag" ? a("aiTable.valueEditor.inputPlaceholder") : void 0,
		value: String(n ?? ""),
		onChange: (t) => r(jn(e.type, t.target.value))
	});
}
function jn(e, t) {
	return e === "number" ? t === "" ? "" : Number(t) : t;
}
//#endregion
//#region src/components/ai-table/AIColorControls.tsx
function Mn({ value: t, onChange: n }) {
	let { t: r } = J(), [i, a] = e.useState(!1), o = e.useRef(null), l = Ke(t);
	return In(o, i, () => a(!1)), /* @__PURE__ */ c("div", {
		ref: o,
		className: "relative shrink-0",
		children: [/* @__PURE__ */ s($, {
			type: "button",
			variant: "outline",
			size: "icon",
			className: "size-9",
			"aria-label": r("aiTable.color.selectColor", { label: l.label }),
			"aria-haspopup": "dialog",
			"aria-expanded": i,
			onClick: () => a((e) => !e),
			children: /* @__PURE__ */ s("span", {
				className: "size-5 rounded-md border border-black/8",
				style: { backgroundColor: l.backgroundColor }
			})
		}), i ? /* @__PURE__ */ c("div", {
			role: "dialog",
			"aria-label": r("aiTable.color.backgroundFill"),
			className: "absolute left-0 top-full z-70 mt-2 w-[380px] rounded-xl border bg-popover p-4 shadow-xl",
			onKeyDown: (e) => {
				e.key === "Escape" && a(!1);
			},
			children: [/* @__PURE__ */ s("p", {
				className: "mb-3 text-sm font-semibold",
				children: r("aiTable.color.backgroundFill")
			}), /* @__PURE__ */ s("div", {
				className: "space-y-2",
				children: He.map((e, r) => /* @__PURE__ */ s("div", {
					className: "grid grid-cols-11 gap-2",
					children: e.map((e) => {
						let r = Ke(t).value === e.value;
						return /* @__PURE__ */ s("button", {
							type: "button",
							"aria-label": e.label,
							"aria-pressed": r,
							className: Q("relative size-7 rounded-md border border-black/5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", r && "ring-2 ring-primary ring-offset-2"),
							style: { backgroundColor: e.backgroundColor },
							onClick: () => {
								n(e.value), a(!1);
							},
							children: r ? /* @__PURE__ */ s(m, {
								className: "absolute inset-0 m-auto size-3.5",
								style: { color: e.foregroundColor }
							}) : null
						}, e.value);
					})
				}, r))
			})]
		}) : null]
	});
}
var Nn = [
	{
		value: "cell",
		labelKey: "aiTable.colorScope.cell",
		titleKey: "aiTable.colorScope.cellTitle",
		descKey: "aiTable.colorScope.cellDesc"
	},
	{
		value: "row",
		labelKey: "aiTable.colorScope.row",
		titleKey: "aiTable.colorScope.rowTitle",
		descKey: "aiTable.colorScope.rowDesc"
	},
	{
		value: "rowMarker",
		labelKey: "aiTable.colorScope.rowMarker",
		titleKey: "aiTable.colorScope.rowMarkerTitle",
		descKey: "aiTable.colorScope.rowMarkerDesc"
	},
	{
		value: "column",
		labelKey: "aiTable.colorScope.column",
		titleKey: "aiTable.colorScope.columnTitle",
		descKey: "aiTable.colorScope.columnDesc"
	}
];
function Pn({ value: t, onChange: n }) {
	let { t: r } = J(), [i, a] = e.useState(!1), [o, l] = e.useState(t), u = e.useRef(null), d = Nn.find((e) => e.value === t) ?? Nn[0], f = Nn.find((e) => e.value === o) ?? d;
	In(u, i, () => a(!1));
	let p = r(d.labelKey), h = r(f.titleKey), g = r(f.descKey);
	return /* @__PURE__ */ c("div", {
		ref: u,
		className: "relative shrink-0",
		children: [/* @__PURE__ */ c($, {
			type: "button",
			variant: "outline",
			className: "h-9 w-24 justify-between px-3 font-normal",
			"aria-label": r("aiTable.color.selectScope", { label: p }),
			"aria-haspopup": "menu",
			"aria-expanded": i,
			onClick: () => {
				l(t), a((e) => !e);
			},
			children: [p, /* @__PURE__ */ s(_, { className: "size-4 text-muted-foreground" })]
		}), i ? /* @__PURE__ */ c("div", {
			className: "absolute left-0 top-full z-60 mt-2 flex w-[560px] items-start gap-2",
			children: [/* @__PURE__ */ s("div", {
				role: "menu",
				"aria-label": r("aiTable.color.scopeMenu"),
				className: "w-36 rounded-xl border bg-popover p-1.5 shadow-xl",
				children: Nn.map((e) => /* @__PURE__ */ c("button", {
					type: "button",
					role: "menuitemradio",
					"aria-checked": e.value === t,
					className: Q("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm outline-none hover:bg-muted focus:bg-muted", e.value === o && "bg-muted", e.value === t && "bg-primary/8"),
					onPointerEnter: () => l(e.value),
					onFocus: () => l(e.value),
					onClick: () => {
						n(e.value), a(!1);
					},
					children: [r(e.labelKey), e.value === t ? /* @__PURE__ */ s(m, { className: "size-4 text-primary" }) : null]
				}, e.value))
			}), /* @__PURE__ */ c("div", {
				className: "w-[416px] rounded-xl bg-[#484a58] p-4 text-white shadow-xl",
				children: [
					/* @__PURE__ */ s("p", {
						className: "text-base font-semibold",
						children: h
					}),
					/* @__PURE__ */ s("p", {
						className: "mt-1 text-sm leading-5 text-white/65",
						children: g
					}),
					/* @__PURE__ */ s(Fn, { scope: f.value })
				]
			})]
		}) : null]
	});
}
function Fn({ scope: e }) {
	let { t } = J();
	return /* @__PURE__ */ s("div", {
		className: "mt-4 overflow-hidden rounded-lg border border-white/25 bg-card text-foreground",
		children: /* @__PURE__ */ c("table", {
			className: "w-full table-fixed text-[10px]",
			children: [/* @__PURE__ */ s("thead", { children: /* @__PURE__ */ c("tr", {
				className: "border-b bg-muted/70 text-muted-foreground",
				children: [
					/* @__PURE__ */ s("th", {
						className: "w-1/2 px-2 py-1.5 text-left font-medium",
						children: /* @__PURE__ */ c("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ s(P, { className: "size-3" }), t("aiTable.colorScope.previewTask")]
						})
					}),
					/* @__PURE__ */ s("th", {
						className: Q("px-2 py-1.5 text-left font-medium", e === "column" && "bg-purple-100"),
						children: /* @__PURE__ */ c("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ s(j, { className: "size-3" }), t("aiTable.colorScope.previewPriority")]
						})
					}),
					/* @__PURE__ */ s("th", {
						className: "px-2 py-1.5 text-left font-medium",
						children: /* @__PURE__ */ c("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ s(ce, { className: "size-3" }), t("aiTable.colorScope.previewStatus")]
						})
					})
				]
			}) }), /* @__PURE__ */ s("tbody", { children: [
				[
					"客户演示准备",
					"P0",
					"进行中"
				],
				[
					"广告投放策略",
					"P1",
					"进行中"
				],
				[
					"满意度调查",
					"P1",
					"已完成"
				],
				[
					"最终测试",
					"P0",
					"已完成"
				]
			].map((t, n) => /* @__PURE__ */ c("tr", {
				className: Q("border-b last:border-b-0", e === "row" && (n === 0 || n === 3) && "bg-red-50"),
				children: [
					/* @__PURE__ */ c("td", {
						className: "relative truncate px-2 py-1.5",
						children: [e === "rowMarker" ? /* @__PURE__ */ s("span", { className: Q("absolute inset-y-0 left-0 w-0.5", n % 2 ? "bg-amber-400" : "bg-primary") }) : null, t[0]]
					}),
					/* @__PURE__ */ s("td", {
						className: Q("px-2 py-1.5", e === "cell" && (n === 1 || n === 3) && "bg-red-100", e === "column" && "bg-purple-100"),
						children: t[1]
					}),
					/* @__PURE__ */ s("td", {
						className: "px-2 py-1.5",
						children: t[2]
					})
				]
			}, t[0])) })]
		})
	});
}
function In(t, n, r) {
	e.useEffect(() => {
		if (!n) return;
		let e = (e) => {
			t.current?.contains(e.target) || r();
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [
		r,
		n,
		t
	]);
}
//#endregion
//#region src/components/ai-table/AIColorPanel.tsx
function Ln() {
	let { t } = J(), { config: n, draftFields: r, state: i, updateDraft: a, setGenerationState: l } = Z(), u = i.draftView.colorRules, d = r.filter((e) => e.colorable), [f, p] = e.useState(""), [m, h] = e.useState(null), g = i.generationState === "generating", [_, v] = e.useState(null);
	async function y() {
		if (!(!f.trim() || g)) {
			l("generating");
			try {
				let e = await n.aiAdapter.generateColorRules({
					instruction: f,
					fields: r
				});
				e.length ? (a({ colorRules: [...u, ...e] }), h(t("aiTable.color.generated", { count: e.length }))) : h(t("aiTable.color.noRules")), l("success");
			} catch (e) {
				let n = e instanceof Error ? e.message : typeof e == "string" ? e : "";
				h(n || t("aiTable.color.generateFailed")), l("error");
			}
		}
	}
	function b() {
		let e = d.find((e) => /shortage|缺货/i.test(`${e.fieldId} ${e.label}`)) ?? d.find((e) => e.source === "derived") ?? d[0];
		e && a({ colorRules: [...u, {
			id: X("color"),
			scope: "cell",
			fieldId: e.fieldId,
			operator: e.type === "number" ? "greaterThan" : "equals",
			value: e.type === "number" ? 0 : "",
			colorToken: "red"
		}] });
	}
	function x(e, t) {
		a({ colorRules: u.map((n) => n.id === e ? {
			...n,
			...t
		} : n) });
	}
	function S(e) {
		if (_ == null || _ === e) return;
		let t = [...u], [n] = t.splice(_, 1);
		t.splice(e, 0, n), a({ colorRules: t }), v(e);
	}
	return /* @__PURE__ */ c("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ s(Dn, { title: t("aiTable.color.title") }),
			/* @__PURE__ */ c("div", {
				className: "space-y-4 p-4",
				children: [
					/* @__PURE__ */ s(On, {
						value: f,
						onChange: p,
						onSubmit: y,
						loading: g,
						placeholder: t("aiTable.color.placeholder")
					}),
					g ? /* @__PURE__ */ c("p", {
						className: "flex items-center gap-2 text-xs text-primary",
						children: [/* @__PURE__ */ s(F, { className: "size-3.5 animate-spin" }), t("aiTable.color.generating")]
					}) : null,
					m && !g ? /* @__PURE__ */ s("p", {
						className: "text-xs text-description",
						children: m
					}) : null,
					/* @__PURE__ */ c("div", { children: [
						/* @__PURE__ */ c("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ s("p", {
								className: "text-xs text-muted-foreground",
								children: t("aiTable.color.ruleDescription")
							}), /* @__PURE__ */ c($, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-7 gap-1 text-xs text-description",
								children: [/* @__PURE__ */ s(z, { className: "size-3.5" }), t("aiTable.color.smartColor")]
							})]
						}),
						/* @__PURE__ */ s("div", {
							className: "space-y-2",
							children: u.map((e, n) => {
								let i = r.find((t) => t.fieldId === e.fieldId), l = i ? Be(i.type) : [];
								return /* @__PURE__ */ c("div", {
									onDragOver: (e) => {
										e.preventDefault(), S(n);
									},
									className: "relative flex items-center gap-2",
									children: [
										/* @__PURE__ */ s("button", {
											type: "button",
											draggable: !0,
											className: "flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing",
											"aria-label": t("aiTable.color.dragHint", { index: n + 1 }),
											onDragStart: () => v(n),
											onDragEnd: () => v(null),
											children: /* @__PURE__ */ s(A, { className: "size-4" })
										}),
										/* @__PURE__ */ s(Mn, {
											value: e.colorToken,
											onChange: (t) => x(e.id, { colorToken: t })
										}),
										/* @__PURE__ */ s(Pn, {
											value: e.scope,
											onChange: (t) => x(e.id, { scope: t })
										}),
										/* @__PURE__ */ c(mn, {
											value: e.fieldId,
											onValueChange: (t) => {
												let n = r.find((e) => e.fieldId === t);
												x(e.id, {
													fieldId: t,
													operator: n?.type === "number" ? "greaterThan" : "equals",
													value: n?.type === "number" ? 0 : ""
												});
											},
											children: [/* @__PURE__ */ s(_n, {
												className: "w-40",
												children: /* @__PURE__ */ s(gn, {})
											}), /* @__PURE__ */ s(vn, { children: d.map((e) => /* @__PURE__ */ s(wn, {
												fieldId: e.fieldId,
												label: e.label,
												type: e.type
											}, e.fieldId)) })]
										}),
										e.scope === "column" ? /* @__PURE__ */ s("div", {
											className: "flex h-9 min-w-44 flex-1 items-center rounded-md border border-dashed px-3 text-xs text-muted-foreground",
											children: t("aiTable.color.columnHint")
										}) : /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ c(mn, {
											value: e.operator,
											onValueChange: (t) => x(e.id, { operator: t }),
											children: [/* @__PURE__ */ s(_n, {
												className: "w-24",
												children: /* @__PURE__ */ s(gn, {})
											}), /* @__PURE__ */ s(vn, { children: l.map((e) => /* @__PURE__ */ s(yn, {
												value: e.value,
												children: e.label
											}, e.value)) })]
										}), /* @__PURE__ */ s(An, {
											className: "min-w-20 flex-1",
											field: i,
											operator: e.operator,
											value: e.value,
											onChange: (t) => x(e.id, { value: t })
										})] }),
										/* @__PURE__ */ s($, {
											type: "button",
											variant: "ghost",
											size: "icon",
											className: "size-8 text-muted-foreground",
											"aria-label": t("aiTable.color.deleteRule", { index: n + 1 }),
											onClick: () => a({ colorRules: u.filter((t) => t.id !== e.id) }),
											children: /* @__PURE__ */ s(V, { className: "size-4" })
										})
									]
								}, e.id);
							})
						}),
						/* @__PURE__ */ c($, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "mt-3 gap-1",
							onClick: b,
							children: [/* @__PURE__ */ s(I, { className: "size-4" }), t("aiTable.color.addRule")]
						})
					] })
				]
			}),
			/* @__PURE__ */ s(kn, { primaryLabel: t("aiTable.color.apply") })
		]
	});
}
//#endregion
//#region src/components/ui/badge.tsx
var Rn = de("inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive text-white",
		outline: "border-border text-foreground",
		approved: "bg-status-approved/15 text-status-approved border-status-approved/30",
		effective: "bg-status-effective/15 text-status-effective border-status-effective/30",
		muted: "bg-muted text-muted-foreground border-border",
		pending: "bg-status-pending/15 text-status-pending border-status-pending/30",
		rejected: "bg-status-rejected/15 text-status-rejected border-status-rejected/30",
		increase: "bg-qty-increase/15 text-qty-increase border-qty-increase/30",
		decrease: "bg-qty-decrease/15 text-qty-decrease border-qty-decrease/30",
		blue: "bg-blue-50 text-blue-700 border-blue-200",
		purple: "bg-purple-50 text-purple-700 border-purple-200",
		teal: "bg-teal-50 text-teal-700 border-teal-200",
		orange: "bg-orange-50 text-orange-700 border-orange-200",
		rose: "bg-rose-50 text-rose-700 border-rose-200",
		indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
		emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
		amber: "bg-amber-50 text-amber-700 border-amber-200"
	} },
	defaultVariants: { variant: "default" }
});
function zn({ className: e, variant: t = "default", asChild: n = !1, ...r }) {
	return /* @__PURE__ */ s(n ? _e.Root : "span", {
		"data-slot": "badge",
		"data-variant": t,
		className: Q(Rn({ variant: t }), e),
		...r
	});
}
//#endregion
//#region src/components/ui/checkbox.tsx
function Bn({ className: e, ...t }) {
	return /* @__PURE__ */ s(U.Root, {
		"data-slot": "checkbox",
		className: Q("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e),
		...t,
		children: /* @__PURE__ */ s(U.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
			children: /* @__PURE__ */ s(g, {})
		})
	});
}
//#endregion
//#region src/components/ui/tooltip.tsx
function Vn({ delayDuration: e = 0, ...t }) {
	return /* @__PURE__ */ s(ye.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration: e,
		...t
	});
}
function Hn({ ...e }) {
	return /* @__PURE__ */ s(ye.Root, {
		"data-slot": "tooltip",
		...e
	});
}
function Un({ ...e }) {
	return /* @__PURE__ */ s(ye.Trigger, {
		"data-slot": "tooltip-trigger",
		...e
	});
}
function Wn({ className: e, sideOffset: t = 0, children: n, ...r }) {
	return /* @__PURE__ */ s(ye.Portal, { children: /* @__PURE__ */ s("div", {
		className: "ai-table-plugin",
		children: /* @__PURE__ */ c(ye.Content, {
			"data-slot": "tooltip-content",
			sideOffset: t,
			className: Q("z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
			...r,
			children: [n, /* @__PURE__ */ s(ye.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })]
		})
	}) });
}
//#endregion
//#region src/components/ai-table/AIPromptTokenEditor.tsx
var Gn = /\{\{([^}]+)\}\}/g, Kn = e.forwardRef(function({ value: t, fields: n, onChange: r, placeholder: i }, a) {
	let { t: o } = J(), c = e.useRef(null), l = e.useRef(null), u = e.useRef(t), d = e.useMemo(() => new Map(n.map((e) => [e.fieldId, e])), [n]), f = e.useCallback((e) => {
		let t = c.current;
		if (!t) return;
		t.replaceChildren();
		let n = 0;
		for (let r of e.matchAll(Gn)) {
			let i = r.index ?? 0;
			i > n && t.append(document.createTextNode(e.slice(n, i)));
			let a = r[1];
			t.append(qn(a, d.get(a)?.label ?? a)), n = i + r[0].length;
		}
		n < e.length && t.append(document.createTextNode(e.slice(n)));
	}, [d]);
	e.useLayoutEffect(() => {
		u.current === t && c.current?.childNodes.length || (u.current = t, f(t));
	}, [f, t]);
	let p = e.useCallback(() => {
		let e = Jn(c.current);
		u.current = e, r(e);
	}, [r]), m = e.useCallback(() => {
		let e = c.current, t = window.getSelection();
		if (!e || !t?.rangeCount) return;
		let n = t.getRangeAt(0);
		e.contains(n.commonAncestorContainer) && (l.current = n.cloneRange());
	}, []);
	return e.useImperativeHandle(a, () => ({ insertField(e) {
		let t = c.current;
		if (!t) return;
		t.focus();
		let n = window.getSelection(), r = l.current, i = r && t.contains(r.commonAncestorContainer) ? r : document.createRange();
		(!r || !t.contains(r.commonAncestorContainer)) && (i.selectNodeContents(t), i.collapse(!1)), i.deleteContents();
		let a = qn(e.fieldId, e.label), o = document.createTextNode("\xA0");
		i.insertNode(o), i.insertNode(a), i.setStartAfter(o), i.collapse(!0), n?.removeAllRanges(), n?.addRange(i), l.current = i.cloneRange(), p();
	} }), [p]), /* @__PURE__ */ s("div", {
		ref: c,
		role: "textbox",
		"aria-label": o("aiTable.aiField.promptAriaLabel"),
		"aria-multiline": "true",
		contentEditable: !0,
		suppressContentEditableWarning: !0,
		"data-placeholder": i,
		className: "min-h-28 whitespace-pre-wrap break-words px-3 py-2 text-sm leading-6 outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
		onInput: p,
		onKeyUp: m,
		onMouseUp: m,
		onBlur: m
	});
});
function qn(e, t) {
	let n = document.createElement("span");
	n.dataset.aiFieldToken = e, n.contentEditable = "false", n.className = "mx-0.5 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 align-baseline text-xs font-medium leading-5 text-primary", n.setAttribute("aria-label", Y.t("aiTable.aiField.tokenAriaLabel", { label: t }));
	let r = document.createElement("span");
	return r.textContent = "ƒx", r.className = "inline-flex text-[10px] font-semibold opacity-70", n.append(r, document.createTextNode(t)), n;
}
function Jn(e) {
	return e ? Array.from(e.childNodes).map(Yn).join("").replaceAll("\xA0", " ") : "";
}
function Yn(e) {
	if (e.nodeType === Node.TEXT_NODE) return e.textContent ?? "";
	if (!(e instanceof HTMLElement)) return "";
	let t = e.dataset.aiFieldToken;
	if (t) return `{{${t}}}`;
	if (e.tagName === "BR") return "\n";
	let n = Array.from(e.childNodes).map(Yn).join("");
	return e.tagName === "DIV" ? `\n${n}` : n;
}
//#endregion
//#region src/components/ai-table/AIFieldPanel.tsx
function Xn() {
	let { t } = J(), { config: n, draftFields: r, state: i, filteredRows: a, createAIField: o, removeAIField: l, regenerateAIFieldValues: u, saveView: d, setActivePanel: p } = Z(), [m, h] = e.useState(() => X("aiField")), [g, _] = e.useState(""), [v, y] = e.useState("tag"), [b, x] = e.useState(""), [S, C] = e.useState(!1), [w, T] = e.useState(!1), [E, D] = e.useState([]), [O, k] = e.useState(null), [A, j] = e.useState(!1), [M, N] = e.useState(!1), [P, ee] = e.useState(!1), te = e.useRef(null), ne = r.filter((e) => e.aiReadable && e.fieldId !== m), L = {
		fieldId: m,
		name: g,
		outputType: v,
		prompt: b,
		referencedFieldIds: e.useMemo(() => er(b), [b]),
		autoUpdate: S,
		allowEmptyReferencedValues: w
	}, R = !!(g.trim() && b.trim() && a.length), z = R || i.dirty;
	async function ie() {
		if (!R || A) return;
		let e = a.slice(0, 5);
		j(!0), k(null), D(e.map((e, t) => ({
			rowKey: n.rowKey(e),
			status: t === 0 ? "running" : "waiting"
		})));
		try {
			let t = e.filter((e) => Nt(L, e, r)), i = t.length ? await n.aiAdapter.previewAIField({
				definition: L,
				rows: t,
				rowKey: n.rowKey,
				fields: r
			}) : [], a = new Map(i.map((e) => [e.rowKey, e]));
			D(e.map((e) => {
				let t = n.rowKey(e);
				if (!Nt(L, e, r)) return {
					rowKey: t,
					status: "skipped"
				};
				let i = a.get(t);
				return {
					rowKey: t,
					status: i?.error ? "error" : "success",
					value: i?.value,
					error: i?.error
				};
			}));
		} catch (r) {
			let i = r instanceof Error ? r.message : t("aiTable.aiField.generateFailed");
			k(i), D(e.map((e) => ({
				rowKey: n.rowKey(e),
				status: "error",
				error: i
			})));
		} finally {
			j(!1);
		}
	}
	async function B() {
		if (!(!z || M)) {
			N(!0), k(null);
			try {
				R ? (await o(L), oe()) : d();
			} catch (e) {
				k(e instanceof Error ? e.message : t("aiTable.aiField.generateFailed"));
			} finally {
				N(!1);
			}
		}
	}
	function ae(e) {
		let t = ne.find((t) => t.fieldId === e);
		t && te.current?.insertField({
			fieldId: t.fieldId,
			label: t.label
		}), ee(!1);
	}
	function oe() {
		h(X("aiField")), _(""), y("tag"), x(""), C(!1), T(!1), D([]);
	}
	return /* @__PURE__ */ c("div", {
		className: "flex h-full min-h-0 flex-col bg-popover",
		children: [
			/* @__PURE__ */ c("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ c("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ s(f, { className: "size-4 text-primary" }), t("aiTable.aiField.title")]
				}), /* @__PURE__ */ s($, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "size-8",
					"aria-label": t("aiTable.aiField.close"),
					onClick: () => p(null),
					children: /* @__PURE__ */ s(le, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ c("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-4",
				children: [
					O ? /* @__PURE__ */ s("p", {
						role: "alert",
						className: "text-sm text-status-rejected",
						children: O
					}) : null,
					i.draftView.aiFields.length ? /* @__PURE__ */ c("div", {
						className: "rounded-lg border bg-muted/20 p-3",
						children: [/* @__PURE__ */ s("p", {
							className: "mb-2 text-xs font-medium text-description",
							children: t("aiTable.aiField.createdFields")
						}), /* @__PURE__ */ s("div", {
							className: "space-y-1.5",
							children: i.draftView.aiFields.map((e) => /* @__PURE__ */ c("div", {
								className: "flex items-center justify-between rounded-md bg-card px-2 py-1.5",
								children: [/* @__PURE__ */ c("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ s(zn, {
										variant: "blue",
										children: $n(e.outputType)
									}), /* @__PURE__ */ s("span", {
										className: "text-xs font-medium",
										children: e.name
									})]
								}), /* @__PURE__ */ c("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ s($, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "size-7 text-muted-foreground",
										"aria-label": t("aiTable.aiField.rerun", { name: e.name }),
										onClick: () => void u(e.fieldId).catch((e) => k(e instanceof Error ? e.message : t("aiTable.aiField.generateFailed"))),
										children: /* @__PURE__ */ s(re, { className: "size-3.5" })
									}), /* @__PURE__ */ s($, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "size-7 text-muted-foreground",
										"aria-label": t("aiTable.aiField.delete", { name: e.name }),
										onClick: () => l(e.fieldId),
										children: /* @__PURE__ */ s(V, { className: "size-3.5" })
									})]
								})]
							}, e.fieldId))
						})]
					}) : null,
					/* @__PURE__ */ c("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ c("label", {
							className: "text-xs font-medium",
							children: [
								t("aiTable.aiField.fieldName"),
								" ",
								/* @__PURE__ */ s("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ s(En, {
							value: g,
							maxLength: 50,
							onChange: (e) => _(e.target.value),
							placeholder: t("aiTable.aiField.fieldNamePlaceholder")
						})]
					}),
					/* @__PURE__ */ c("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ c("label", {
							className: "text-xs font-medium",
							children: [
								t("aiTable.aiField.outputType"),
								" ",
								/* @__PURE__ */ s("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ c(mn, {
							value: v,
							onValueChange: (e) => y(e),
							children: [/* @__PURE__ */ s(_n, { children: /* @__PURE__ */ s(gn, {}) }), /* @__PURE__ */ c(vn, { children: [
								/* @__PURE__ */ s(yn, {
									value: "text",
									children: t("aiTable.aiField.outputText")
								}),
								/* @__PURE__ */ s(yn, {
									value: "number",
									children: t("aiTable.aiField.outputNumber")
								}),
								/* @__PURE__ */ s(yn, {
									value: "tag",
									children: t("aiTable.aiField.outputTag")
								})
							] })]
						})]
					}),
					/* @__PURE__ */ c("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ c("label", {
							className: "text-xs font-medium",
							children: [
								t("aiTable.aiField.prompt"),
								" ",
								/* @__PURE__ */ s("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ c("div", {
							className: "rounded-lg border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
							children: [/* @__PURE__ */ s(Kn, {
								ref: te,
								value: b,
								fields: ne,
								onChange: x,
								placeholder: t("aiTable.aiField.promptPlaceholder")
							}), /* @__PURE__ */ s("div", {
								className: "flex flex-wrap items-center gap-1.5 border-t px-2 py-2",
								children: /* @__PURE__ */ c(dn, {
									open: P,
									onOpenChange: ee,
									children: [/* @__PURE__ */ s(fn, {
										asChild: !0,
										children: /* @__PURE__ */ c($, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "ml-auto h-7 gap-1 text-xs",
											children: [/* @__PURE__ */ s(I, { className: "size-3.5" }), t("aiTable.aiField.insertField")]
										})
									}), /* @__PURE__ */ s(pn, {
										align: "end",
										className: "w-56 p-1",
										children: ne.map((e) => /* @__PURE__ */ c("button", {
											type: "button",
											className: "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs hover:bg-muted",
											onClick: () => ae(e.fieldId),
											children: [/* @__PURE__ */ s("span", { children: e.label }), /* @__PURE__ */ s("span", {
												className: "text-[10px] text-muted-foreground",
												children: e.source === "derived" ? t("aiTable.aiField.sourceDerived") : e.source === "ai" ? t("aiTable.aiField.sourceAi") : t("aiTable.aiField.sourceBusiness")
											})]
										}, e.fieldId))
									})]
								})
							})]
						})]
					}),
					/* @__PURE__ */ c("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ s("p", {
							className: "text-xs font-medium",
							children: t("aiTable.aiField.generationSettings")
						}), /* @__PURE__ */ s(Vn, { children: /* @__PURE__ */ c("div", {
							className: "space-y-3 rounded-lg border bg-card px-3 py-3",
							children: [/* @__PURE__ */ s(Qn, {
								id: "ai-field-auto-update",
								label: t("aiTable.aiField.autoUpdate"),
								tooltip: t("aiTable.aiField.autoUpdateTooltip"),
								checked: S,
								onCheckedChange: C
							}), /* @__PURE__ */ s(Qn, {
								id: "ai-field-allow-empty-references",
								label: t("aiTable.aiField.allowEmptyReferences"),
								tooltip: t("aiTable.aiField.allowEmptyReferencesTooltip"),
								checked: w,
								onCheckedChange: T
							})]
						}) })]
					}),
					/* @__PURE__ */ c("div", { children: [/* @__PURE__ */ c("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ s("p", {
							className: "text-xs font-medium",
							children: t("aiTable.aiField.preview")
						}), E.length ? /* @__PURE__ */ c($, {
							type: "button",
							variant: "ghost",
							size: "sm",
							className: "h-7 gap-1 text-xs",
							disabled: A,
							onClick: () => void ie(),
							children: [/* @__PURE__ */ s(re, { className: "size-3.5" }), t("aiTable.aiField.repreview")]
						}) : null]
					}), /* @__PURE__ */ c("div", {
						className: "overflow-hidden rounded-lg border",
						children: [
							/* @__PURE__ */ c("div", {
								className: "grid grid-cols-[1.2fr_1fr] bg-muted/40 px-3 py-2 text-[11px] font-medium text-description",
								children: [/* @__PURE__ */ s("span", { children: t("aiTable.aiField.record") }), /* @__PURE__ */ s("span", { children: t("aiTable.aiField.previewColumn", { name: g || t("aiTable.aiField.title") }) })]
							}),
							(E.length ? E : a.slice(0, 5).map((e) => ({
								rowKey: n.rowKey(e),
								status: "waiting"
							}))).map((e) => /* @__PURE__ */ c("div", {
								className: "grid grid-cols-[1.2fr_1fr] border-t px-3 py-2 text-xs",
								children: [/* @__PURE__ */ s("span", {
									className: "truncate font-mono text-description",
									children: e.rowKey
								}), /* @__PURE__ */ s(Zn, { row: e })]
							}, e.rowKey)),
							a.length ? null : /* @__PURE__ */ s("p", {
								className: "px-3 py-4 text-center text-xs text-muted-foreground",
								children: t("aiTable.aiField.noRecords")
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ c("div", {
				className: "flex items-center justify-end gap-2 border-t px-4 py-3",
				children: [
					/* @__PURE__ */ s($, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => p(null),
						children: t("aiTable.aiField.cancel")
					}),
					/* @__PURE__ */ c($, {
						type: "button",
						variant: "outline",
						size: "sm",
						disabled: !R || A,
						onClick: () => void ie(),
						children: [A ? /* @__PURE__ */ s(F, { className: "size-4 animate-spin" }) : null, t("aiTable.aiField.runPreview")]
					}),
					/* @__PURE__ */ c($, {
						type: "button",
						size: "sm",
						disabled: !z || M,
						onClick: () => void B(),
						children: [M ? /* @__PURE__ */ s(F, { className: "size-4 animate-spin" }) : null, t("aiTable.aiField.save")]
					})
				]
			})
		]
	});
}
function Zn({ row: e }) {
	let { t } = J();
	return e.status === "running" ? /* @__PURE__ */ c("span", {
		className: "flex items-center gap-1 text-primary",
		children: [/* @__PURE__ */ s(F, { className: "size-3.5 animate-spin" }), t("aiTable.aiField.generating")]
	}) : e.status === "success" ? /* @__PURE__ */ c("span", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ s(h, { className: "size-3.5 text-status-approved" }), String(e.value ?? "—")]
	}) : e.status === "error" ? /* @__PURE__ */ s("span", {
		className: "text-status-rejected",
		children: e.error ?? t("aiTable.aiField.generateFailed")
	}) : e.status === "skipped" ? /* @__PURE__ */ s("span", {
		className: "text-muted-foreground",
		children: t("aiTable.aiField.skipped")
	}) : /* @__PURE__ */ s("span", {
		className: "text-muted-foreground",
		children: t("aiTable.aiField.waiting")
	});
}
function Qn({ id: e, label: t, tooltip: n, checked: r, onCheckedChange: i }) {
	let { t: a } = J();
	return /* @__PURE__ */ c("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ s(Bn, {
				id: e,
				checked: r,
				onCheckedChange: (e) => i(e === !0)
			}),
			/* @__PURE__ */ s("label", {
				htmlFor: e,
				className: "cursor-pointer text-sm font-medium",
				children: t
			}),
			/* @__PURE__ */ c(Hn, { children: [/* @__PURE__ */ s(Un, {
				asChild: !0,
				children: /* @__PURE__ */ s("button", {
					type: "button",
					className: "text-muted-foreground transition-colors hover:text-foreground",
					"aria-label": `${t}${a("aiTable.aiField.tooltipSuffix")}`,
					children: /* @__PURE__ */ s(M, { className: "size-4" })
				})
			}), /* @__PURE__ */ s(Wn, {
				side: "top",
				sideOffset: 6,
				className: "max-w-64 text-xs leading-5",
				children: n
			})] })
		]
	});
}
function $n(e) {
	return e === "tag" ? Y.t("aiTable.aiField.outputTag") : e === "number" ? Y.t("aiTable.aiField.outputNumber") : Y.t("aiTable.aiField.outputText");
}
function er(e) {
	return [...new Set(Array.from(e.matchAll(/\{\{([^}]+)\}\}/g), (e) => e[1]))];
}
//#endregion
//#region src/components/ai-table/AITableConditionBuilder.tsx
function tr({ fields: e, value: t, onChange: n }) {
	let { t: r } = J(), i = e.filter((e) => e.filterable);
	function a(e = "and") {
		let r = i.find((e) => e.type === "tag") ?? i[0];
		r && n([...t, {
			id: X("filter"),
			fieldId: r.fieldId,
			operator: Be(r.type)[0].value,
			value: "",
			conjunction: t.length ? e : "and"
		}]);
	}
	function o(e, r) {
		n(t.map((t) => t.id === e ? {
			...t,
			...r
		} : t));
	}
	return /* @__PURE__ */ c("div", { children: [
		/* @__PURE__ */ s("p", {
			className: "mb-3 text-xs text-muted-foreground",
			children: r("aiTable.filter.conditionDescription")
		}),
		/* @__PURE__ */ s("div", {
			className: "space-y-2",
			children: t.map((a, l) => {
				let u = e.find((e) => e.fieldId === a.fieldId), d = u ? Be(u.type) : [];
				return /* @__PURE__ */ c("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ s(A, { className: "size-4 shrink-0 text-muted-foreground/60" }),
						l === 0 ? /* @__PURE__ */ s("span", {
							className: "w-12 shrink-0 text-sm font-medium",
							children: r("aiTable.filter.when")
						}) : /* @__PURE__ */ c(mn, {
							value: a.conjunction,
							onValueChange: (e) => o(a.id, { conjunction: e }),
							children: [/* @__PURE__ */ s(_n, {
								className: "w-[68px] shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ s(gn, { children: a.conjunction === "and" ? r("aiTable.filter.and") : r("aiTable.filter.or") })
							}), /* @__PURE__ */ c(vn, { children: [/* @__PURE__ */ s(yn, {
								value: "and",
								children: r("aiTable.filter.and")
							}), /* @__PURE__ */ s(yn, {
								value: "or",
								children: r("aiTable.filter.or")
							})] })]
						}),
						/* @__PURE__ */ c(mn, {
							value: a.fieldId,
							onValueChange: (t) => {
								let n = e.find((e) => e.fieldId === t);
								o(a.id, {
									fieldId: t,
									operator: Be(n?.type ?? "text")[0].value,
									value: ""
								});
							},
							children: [/* @__PURE__ */ s(_n, {
								className: "w-36 shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ s(gn, {})
							}), /* @__PURE__ */ s(vn, { children: i.map((e) => /* @__PURE__ */ s(wn, {
								fieldId: e.fieldId,
								label: e.label,
								type: e.type
							}, e.fieldId)) })]
						}),
						/* @__PURE__ */ c(mn, {
							value: a.operator,
							onValueChange: (e) => o(a.id, { operator: e }),
							children: [/* @__PURE__ */ s(_n, {
								className: "w-28 shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ s(gn, {})
							}), /* @__PURE__ */ s(vn, { children: d.map((e) => /* @__PURE__ */ s(yn, {
								value: e.value,
								children: e.label
							}, e.value)) })]
						}),
						/* @__PURE__ */ s(An, {
							className: "min-w-0 flex-1",
							field: u,
							operator: a.operator,
							value: a.value,
							onChange: (e) => o(a.id, { value: e })
						}),
						/* @__PURE__ */ s($, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "size-8 shrink-0 text-muted-foreground",
							"aria-label": r("aiTable.filter.deleteCondition", { index: l + 1 }),
							onClick: () => n(t.filter((e) => e.id !== a.id)),
							children: /* @__PURE__ */ s(V, { className: "size-4" })
						})
					]
				}, a.id);
			})
		}),
		/* @__PURE__ */ c("div", {
			className: "mt-3 flex items-center gap-2",
			children: [/* @__PURE__ */ c($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "gap-1 px-2",
				onClick: () => a("and"),
				children: [/* @__PURE__ */ s(I, { className: "size-4" }), r("aiTable.filter.addCondition")]
			}), /* @__PURE__ */ c($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "gap-1 px-2",
				onClick: () => a("or"),
				children: [/* @__PURE__ */ s(I, { className: "size-4" }), r("aiTable.filter.addConditionGroup")]
			})]
		})
	] });
}
//#endregion
//#region src/components/ai-table/AIFilterPanel.tsx
function nr() {
	let { t } = J(), { config: n, draftFields: r, queryFieldIds: i, state: a, updateDraft: o, setGenerationState: l } = Z(), u = a.draftView.filters, d = r.filter((e) => e.filterable && (!i || i.includes(e.fieldId))), [f, p] = e.useState(""), [m, h] = e.useState(null), g = a.generationState === "generating";
	async function _() {
		if (!(!f.trim() || g)) {
			l("generating"), h(null);
			try {
				let e = await n.aiAdapter.generateFilters({
					instruction: f,
					fields: d
				});
				e.length ? (o({ filters: [...u, ...e] }), h(t("aiTable.filter.generated", { instruction: f }))) : h(t("aiTable.filter.noConditions")), l("success");
			} catch (e) {
				let n = e instanceof Error ? e.message : typeof e == "string" ? e : "";
				h(n || t("aiTable.filter.generateFailed")), l("error");
			}
		}
	}
	return /* @__PURE__ */ c("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ s(Dn, { title: t("aiTable.filter.title") }),
			/* @__PURE__ */ c("div", {
				className: "space-y-4 p-4",
				children: [
					/* @__PURE__ */ s(On, {
						value: f,
						onChange: p,
						onSubmit: _,
						loading: g,
						placeholder: t("aiTable.filter.placeholder")
					}),
					g ? /* @__PURE__ */ c("div", {
						className: "flex items-center gap-2 text-xs text-primary",
						children: [/* @__PURE__ */ s(F, { className: "size-3.5 animate-spin" }), t("aiTable.filter.generating", { instruction: f })]
					}) : m ? /* @__PURE__ */ c("div", {
						className: "flex items-center justify-between text-xs text-description",
						children: [/* @__PURE__ */ s("span", { children: m }), /* @__PURE__ */ c("div", {
							className: "flex items-center gap-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ s($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": t("aiTable.filter.feedbackHelpful"),
									children: /* @__PURE__ */ s(oe, { className: "size-3.5" })
								}),
								/* @__PURE__ */ s($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": t("aiTable.filter.feedbackUnhelpful"),
									children: /* @__PURE__ */ s(ae, { className: "size-3.5" })
								}),
								/* @__PURE__ */ s($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": t("aiTable.filter.copyInstruction"),
									children: /* @__PURE__ */ s(O, { className: "size-3.5" })
								})
							]
						})]
					}) : null,
					/* @__PURE__ */ s(tr, {
						fields: d,
						value: u,
						onChange: (e) => o({ filters: e })
					})
				]
			}),
			/* @__PURE__ */ s(kn, {})
		]
	});
}
//#endregion
//#region src/components/ai-table/AIGroupingPanel.tsx
var rr = 2;
function ir() {
	let { t } = J(), { draftFields: n, rows: r, state: i, updateDraft: a } = Z(), o = i.draftView.groups, l = n.filter((e) => e.groupable), [u, d] = e.useState(null);
	function f() {
		if (o.length >= rr) return;
		let e = new Set(o.map((e) => e.fieldId)), t = l.find((t) => !e.has(t.fieldId) && t.source === "ai") ?? l.find((t) => !e.has(t.fieldId) && t.type === "tag") ?? l.find((t) => !e.has(t.fieldId));
		t && a({ groups: [...o, {
			fieldId: t.fieldId,
			direction: "asc"
		}] });
	}
	function p(e, t) {
		a({ groups: o.map((n, r) => r === e ? {
			...n,
			...t
		} : n) });
	}
	function m(e) {
		if (u == null || u === e) return;
		let t = [...o], [n] = t.splice(u, 1);
		t.splice(e, 0, n), a({ groups: t }), d(e);
	}
	function h() {
		let e = et(Ze(r, i.savedView.filters, n), o, n, []);
		a({ collapsedGroupKeys: ar(e) });
	}
	return /* @__PURE__ */ c("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ s(Dn, {
				title: t("aiTable.group.title"),
				actions: o.length ? /* @__PURE__ */ c("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ s($, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "h-7 text-xs",
						onClick: h,
						children: t("aiTable.group.collapseAll")
					}), /* @__PURE__ */ s($, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "h-7 text-xs",
						onClick: () => a({ collapsedGroupKeys: [] }),
						children: t("aiTable.group.expandAll")
					})]
				}) : null
			}),
			/* @__PURE__ */ c("div", {
				className: "space-y-2 p-4",
				children: [
					o.map((e, n) => /* @__PURE__ */ c("div", {
						draggable: !0,
						onDragStart: () => d(n),
						onDragOver: (e) => {
							e.preventDefault(), m(n);
						},
						onDragEnd: () => d(null),
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ s(A, { className: "size-4 cursor-grab text-muted-foreground" }),
							/* @__PURE__ */ c(mn, {
								value: e.fieldId,
								onValueChange: (e) => p(n, { fieldId: e }),
								children: [/* @__PURE__ */ s(_n, {
									className: "flex-1",
									children: /* @__PURE__ */ s(gn, {})
								}), /* @__PURE__ */ s(vn, { children: l.map((e) => /* @__PURE__ */ s(wn, {
									fieldId: e.fieldId,
									label: e.label,
									type: e.type
								}, e.fieldId)) })]
							}),
							/* @__PURE__ */ c("div", {
								className: "flex rounded-md bg-muted p-0.5",
								children: [/* @__PURE__ */ s($, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: e.direction === "asc" ? "h-8 bg-card px-3 text-xs text-primary shadow-sm" : "h-8 px-3 text-xs text-muted-foreground",
									onClick: () => p(n, { direction: "asc" }),
									children: t("aiTable.group.optionOrder")
								}), /* @__PURE__ */ s($, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: e.direction === "desc" ? "h-8 bg-card px-3 text-xs text-primary shadow-sm" : "h-8 px-3 text-xs text-muted-foreground",
									onClick: () => p(n, { direction: "desc" }),
									children: t("aiTable.group.optionReverse")
								})]
							}),
							/* @__PURE__ */ s($, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "size-8 text-muted-foreground",
								"aria-label": t("aiTable.group.deleteGroup", { index: n + 1 }),
								onClick: () => a({ groups: o.filter((e, t) => t !== n) }),
								children: /* @__PURE__ */ s(V, { className: "size-4" })
							})
						]
					}, `${e.fieldId}-${n}`)),
					o.length < rr ? /* @__PURE__ */ c($, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2 gap-1",
						onClick: f,
						children: [/* @__PURE__ */ s(I, { className: "size-4" }), t("aiTable.group.addGroup")]
					}) : null,
					o.length ? null : /* @__PURE__ */ s("p", {
						className: "py-4 text-center text-xs text-muted-foreground",
						children: t("aiTable.group.emptyHint")
					})
				]
			}),
			/* @__PURE__ */ s(kn, { primaryLabel: t("aiTable.group.apply") })
		]
	});
}
function ar(e) {
	return e.flatMap((e) => [e.key, ...e.children ? ar(e.children) : []]);
}
//#endregion
//#region src/components/ai-table/AISortingPanel.tsx
function or() {
	let { t } = J(), { draftFields: n, queryFieldIds: r, state: i, updateDraft: a } = Z(), o = i.draftView.sorts, l = n.filter((e) => e.sortable && (!r || r.includes(e.fieldId))), [u, d] = e.useState(null);
	function f() {
		let e = new Set(o.map((e) => e.fieldId)), t = l.find((t) => !e.has(t.fieldId));
		t && a({ sorts: [...o, {
			fieldId: t.fieldId,
			direction: "asc"
		}] });
	}
	function p(e, t) {
		a({ sorts: o.map((n, r) => r === e ? {
			...n,
			...t
		} : n) });
	}
	function m(e) {
		if (u == null || u === e) return;
		let t = [...o], [n] = t.splice(u, 1);
		t.splice(e, 0, n), a({ sorts: t }), d(e);
	}
	let h = new Set(o.map((e) => e.fieldId)), g = l.some((e) => !h.has(e.fieldId));
	return /* @__PURE__ */ c("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ s(Dn, { title: t("aiTable.sort.title") }),
			/* @__PURE__ */ c("div", {
				className: "space-y-2 p-4",
				children: [
					o.map((e, n) => /* @__PURE__ */ c("div", {
						className: "flex items-center gap-2",
						onDragOver: (e) => {
							e.preventDefault(), m(n);
						},
						children: [
							/* @__PURE__ */ s("button", {
								type: "button",
								draggable: !0,
								className: "flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing",
								"aria-label": t("aiTable.sort.dragHint", { index: n + 1 }),
								onDragStart: () => d(n),
								onDragEnd: () => d(null),
								children: /* @__PURE__ */ s(A, { className: "size-4" })
							}),
							/* @__PURE__ */ c(mn, {
								value: e.fieldId,
								onValueChange: (e) => p(n, { fieldId: e }),
								children: [/* @__PURE__ */ s(_n, {
									className: "min-w-0 flex-1",
									children: /* @__PURE__ */ s(gn, {})
								}), /* @__PURE__ */ s(vn, { children: l.map((t) => /* @__PURE__ */ s(wn, {
									fieldId: t.fieldId,
									label: t.label,
									type: t.type,
									disabled: t.fieldId !== e.fieldId && h.has(t.fieldId)
								}, t.fieldId)) })]
							}),
							/* @__PURE__ */ c("div", {
								className: "flex shrink-0 rounded-lg bg-muted p-1",
								children: [/* @__PURE__ */ s(sr, {
									active: e.direction === "asc",
									label: "A → Z",
									ariaLabel: t("aiTable.sort.asc", { index: n + 1 }),
									onClick: () => p(n, { direction: "asc" })
								}), /* @__PURE__ */ s(sr, {
									active: e.direction === "desc",
									label: "Z → A",
									ariaLabel: t("aiTable.sort.desc", { index: n + 1 }),
									onClick: () => p(n, { direction: "desc" })
								})]
							}),
							/* @__PURE__ */ s($, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "size-8 shrink-0 text-muted-foreground",
								"aria-label": t("aiTable.sort.deleteSort", { index: n + 1 }),
								onClick: () => a({ sorts: o.filter((e, t) => t !== n) }),
								children: /* @__PURE__ */ s(V, { className: "size-4" })
							})
						]
					}, `${e.fieldId}-${n}`)),
					g ? /* @__PURE__ */ c($, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2 gap-1",
						onClick: f,
						children: [/* @__PURE__ */ s(I, { className: "size-4" }), t("aiTable.sort.addSort")]
					}) : null,
					o.length ? null : /* @__PURE__ */ s("p", {
						className: "py-4 text-center text-xs text-muted-foreground",
						children: t("aiTable.sort.emptyHint")
					})
				]
			}),
			/* @__PURE__ */ s(kn, { primaryLabel: t("aiTable.sort.apply") })
		]
	});
}
function sr({ active: e, label: t, ariaLabel: n, onClick: r }) {
	return /* @__PURE__ */ s($, {
		type: "button",
		variant: "ghost",
		size: "sm",
		className: Q("h-8 min-w-20 px-3 text-sm", e ? "bg-card text-primary shadow-sm" : "text-muted-foreground"),
		"aria-label": n,
		"aria-pressed": e,
		onClick: r,
		children: t
	});
}
//#endregion
//#region src/components/ai-table/AITableToolbar.tsx
function cr({ openColumnSettings: e, selectedCount: t = 0 }) {
	let { t: n } = J(), { state: r, setActivePanel: i, appliedFields: a, restoreDefaultView: o } = Z(), { savedView: l } = r, u = a.find((e) => e.fieldId === l.groups[0]?.fieldId), f = [
		{
			panel: "filter",
			icon: /* @__PURE__ */ s(k, { className: "size-4" }),
			label: n("aiTable.toolbar.filter"),
			summary: ct(l.filters),
			content: /* @__PURE__ */ s(nr, {}),
			width: "w-[590px]"
		},
		{
			panel: "group",
			icon: /* @__PURE__ */ s(N, { className: "size-4" }),
			label: n("aiTable.toolbar.group"),
			summary: u ? n("aiTable.toolbar.groupSummaryByField", { field: u.label }) : null,
			content: /* @__PURE__ */ s(ir, {}),
			width: "w-[520px]"
		},
		{
			panel: "sort",
			icon: /* @__PURE__ */ s(d, { className: "size-4" }),
			label: n("aiTable.toolbar.sort"),
			summary: ut(l.sorts, a),
			content: /* @__PURE__ */ s(or, {}),
			width: "w-[620px]"
		},
		{
			panel: "color",
			icon: /* @__PURE__ */ s(te, { className: "size-4" }),
			label: n("aiTable.toolbar.color"),
			summary: mt(l.colorRules),
			content: /* @__PURE__ */ s(Ln, {}),
			width: "w-[700px]"
		},
		{
			panel: "aiField",
			icon: /* @__PURE__ */ s(I, { className: "size-4" }),
			label: n("aiTable.toolbar.addField"),
			content: /* @__PURE__ */ s(Xn, {}),
			width: "w-[540px]"
		}
	];
	return /* @__PURE__ */ c("div", {
		className: "flex min-w-0 items-center gap-1",
		children: [
			t > 0 ? /* @__PURE__ */ s("span", {
				className: "mr-2 whitespace-nowrap text-xs font-medium text-description",
				children: n("wms.selectedCount", { count: t })
			}) : null,
			/* @__PURE__ */ c("div", {
				className: "mr-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-description",
				children: [/* @__PURE__ */ s(z, { className: "size-4 text-primary" }), n("aiTable.toolbar.savedView")]
			}),
			f.map((e) => /* @__PURE__ */ s(lr, {
				...e,
				activePanel: r.activePanel,
				setActivePanel: i
			}, e.panel)),
			/* @__PURE__ */ c($, {
				type: "button",
				"aria-label": n("aiTable.toolbar.restoreDefault", "恢复默认视图"),
				title: n("aiTable.toolbar.restoreDefault", "恢复默认视图"),
				variant: "ghost",
				size: "sm",
				className: "h-8 gap-1.5 whitespace-nowrap px-3 text-xs text-description",
				onClick: o,
				children: [/* @__PURE__ */ s(L, { className: "size-4" }), n("aiTable.toolbar.restoreDefault", "恢复默认视图")]
			}),
			e ? /* @__PURE__ */ c($, {
				type: "button",
				"aria-label": n("wms.columnSettings.title", "列设置"),
				title: n("wms.columnSettings.title", "列设置"),
				variant: "ghost",
				size: "sm",
				className: "h-8 gap-1.5 whitespace-nowrap px-3 text-xs text-description",
				onClick: e,
				children: [/* @__PURE__ */ s(R, { className: "size-4" }), n("wms.columnSettings.title", "列设置")]
			}) : null
		]
	});
}
function lr({ panel: e, icon: t, label: n, summary: r, content: i, width: a, activePanel: o, setActivePanel: l }) {
	let u = o === e;
	return /* @__PURE__ */ c(dn, {
		open: u,
		onOpenChange: (t) => l(t ? e : null),
		children: [/* @__PURE__ */ s(fn, {
			asChild: !0,
			children: /* @__PURE__ */ c($, {
				type: "button",
				"aria-label": n,
				variant: "ghost",
				size: "sm",
				className: Q("h-8 gap-1.5 whitespace-nowrap border border-transparent px-3 text-xs text-description", (u || r) && "border-primary/20 bg-primary/6 text-foreground"),
				children: [
					/* @__PURE__ */ s("span", {
						className: Q(u && "text-primary"),
						children: t
					}),
					r ?? n,
					e === "filter" && r ? /* @__PURE__ */ s("span", {
						className: "flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground",
						children: Math.max(1, Number(r.match(/\d+/)?.[0] ?? 1))
					}) : null
				]
			})
		}), /* @__PURE__ */ s(pn, {
			align: "start",
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 16,
			style: e === "aiField" ? { height: "min(680px, var(--radix-popover-content-available-height))" } : void 0,
			className: Q("max-h-[min(calc(100vh-32px),var(--radix-popover-content-available-height))] rounded-xl p-0 shadow-xl", e === "aiField" ? "h-[min(680px,var(--radix-popover-content-available-height))] min-h-0 overflow-hidden" : e === "color" ? "overflow-visible" : "overflow-y-auto", a),
			children: i
		})]
	});
}
//#endregion
//#region src/components/ai-table/AITableDraftBar.tsx
var ur = {
	filter: "aiTable.draftBar.filter",
	group: "aiTable.draftBar.group",
	sort: "aiTable.draftBar.sort",
	color: "aiTable.draftBar.color",
	aiField: "aiTable.draftBar.aiField"
};
function dr() {
	let { t: e } = J(), { state: t, saveView: n, cancelDraft: r } = Z();
	return t.dirty ? /* @__PURE__ */ c("div", {
		className: "flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary/6 pl-3 text-xs text-description",
		children: [
			/* @__PURE__ */ s("span", { children: e("aiTable.draftBar.adjustedConfig", { label: t.activePanel ? e(ur[t.activePanel]) : e("aiTable.draftBar.view") }) }),
			/* @__PURE__ */ s($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-8 px-2 text-xs text-primary",
				onClick: r,
				children: e("aiTable.draftBar.cancel")
			}),
			/* @__PURE__ */ s($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-8 px-2 text-xs text-primary",
				onClick: n,
				children: e("aiTable.draftBar.save")
			})
		]
	}) : /* @__PURE__ */ c("div", {
		className: "flex items-center gap-1.5 whitespace-nowrap text-xs text-description",
		children: [/* @__PURE__ */ s(h, { className: "size-4 text-status-approved" }), e("aiTable.draftBar.viewSaved")]
	});
}
//#endregion
//#region src/components/ai-table/AITableFreezeBoundary.tsx
function fr() {
	let { t } = J(), { config: n, state: r, updateDraft: i } = Z(), { draftView: a } = r, o = a.frozenColumnCount, l = e.useMemo(() => n.fields.filter((e) => e.source === "business" || e.source === "derived").length, [n.fields]), u = it(o, l);
	function d() {
		let e = it(u + 1, l);
		i({ frozenColumnCount: e });
	}
	function f() {
		let e = it(u - 1, l);
		i({ frozenColumnCount: e });
	}
	function p() {
		i({ frozenColumnCount: 0 });
	}
	return l === 0 ? null : /* @__PURE__ */ c("div", {
		className: "flex items-center gap-2 border-t bg-card px-4 py-2 lg:px-6",
		children: [
			/* @__PURE__ */ s(ne, { className: "size-3.5 text-muted-foreground" }),
			/* @__PURE__ */ s("span", {
				className: "text-xs text-muted-foreground",
				children: t("aiTable.freeze.frozenColumns")
			}),
			/* @__PURE__ */ c("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ s($, {
						type: "button",
						variant: "outline",
						size: "icon",
						className: "size-7",
						disabled: u === 0,
						onClick: f,
						children: /* @__PURE__ */ s(S, { className: "size-3.5" })
					}),
					/* @__PURE__ */ c("span", {
						className: "min-w-[60px] text-center text-xs font-medium tabular-nums",
						children: [
							u,
							" / ",
							l,
							" ",
							t("aiTable.freeze.columnUnit")
						]
					}),
					/* @__PURE__ */ s($, {
						type: "button",
						variant: "outline",
						size: "icon",
						className: "size-7",
						disabled: u >= l - 1,
						onClick: d,
						children: /* @__PURE__ */ s(w, { className: "size-3.5" })
					})
				]
			}),
			u > 0 && /* @__PURE__ */ s($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-7 text-xs text-muted-foreground",
				onClick: p,
				children: t("aiTable.freeze.clearFreeze")
			}),
			u === 0 && /* @__PURE__ */ s("span", {
				className: "text-xs text-muted-foreground",
				children: t("aiTable.freeze.hint")
			})
		]
	});
}
//#endregion
//#region src/components/ui/progress.tsx
function pr({ className: e, value: t, ...n }) {
	return /* @__PURE__ */ s(ge.Root, {
		"data-slot": "progress",
		value: t,
		className: Q("relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted", e),
		...n,
		children: /* @__PURE__ */ s(ge.Indicator, {
			"data-slot": "progress-indicator",
			className: "size-full flex-1 bg-primary transition-all",
			style: { transform: `translateX(-${100 - (t || 0)}%)` }
		})
	});
}
//#endregion
//#region src/hooks/useColumnSettings.ts
function mr(e, t = "medium") {
	return {
		order: e.map((e) => e.id),
		visible: e.filter((e) => e.required || e.defaultVisible !== !1).map((e) => e.id),
		density: t
	};
}
function hr(e, t, n = "medium") {
	if (!e || t.length === 0) return mr(t, n);
	let r = t.map((e) => e.id), i = new Set(r), a = t.filter((e) => e.required).map((e) => e.id), o = mr(t, n), s = Array.from(new Set((e.order ?? []).filter((e) => i.has(e))));
	for (let e of r) s.includes(e) || s.push(e);
	let c = t.filter((e) => e.pinned).map((e) => e.id);
	for (let e = c.length - 1; e >= 0; e--) {
		let t = s.indexOf(c[e]);
		t > 0 && (s.splice(t, 1), s.unshift(c[e]));
	}
	let l = Array.from(new Set((e.visible ?? []).filter((e) => i.has(e))));
	l.length === 0 && (l = [...o.visible]);
	for (let e of a) l.includes(e) || l.push(e);
	return {
		order: s,
		visible: l,
		density: e.density ?? n
	};
}
var gr = "__noop__";
function _r(e) {
	let { storageKey: i, fields: o, defaultDensity: s = "medium" } = e, c = r(() => mr(o, s), [o, s]), [l, u] = a(c);
	return n(() => {
		if (!(typeof window > "u") && !(i === gr || o.length === 0)) try {
			let e = window.localStorage.getItem(i);
			if (!e) {
				u(c);
				return;
			}
			let t = JSON.parse(e);
			u(hr(t, o, s));
		} catch {
			u(c);
		}
	}, [
		i,
		c,
		o,
		s
	]), {
		state: l,
		defaultState: c,
		applyState: t((e) => {
			let t = hr(e, o, s);
			u(t), typeof window < "u" && i !== gr && o.length > 0 && window.localStorage.setItem(i, JSON.stringify(t));
		}, [
			i,
			o,
			s
		]),
		columnVisibility: r(() => {
			let e = {};
			for (let t of o) e[t.id] = l.visible.includes(t.id);
			return e;
		}, [l.visible, o]),
		density: l.density
	};
}
//#endregion
//#region src/components/ui/sheet.tsx
var vr = e.createContext("right");
function yr({ direction: e = "right", children: t, ...n }) {
	return Vt(n.open, n.onOpenChange), /* @__PURE__ */ s(vr.Provider, {
		value: e,
		children: /* @__PURE__ */ s(fe.Root, {
			"data-slot": "sheet",
			...n,
			children: t
		})
	});
}
function br({ ...e }) {
	return /* @__PURE__ */ s(fe.Portal, {
		"data-slot": "sheet-portal",
		...e
	});
}
function xr({ className: e, ...t }) {
	return /* @__PURE__ */ s(fe.Overlay, {
		"data-slot": "sheet-overlay",
		className: Q("fixed inset-0 z-50 bg-overlay", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0", e),
		...t
	});
}
var Sr = de(Q("group/sheet-content fixed z-50 flex flex-col bg-card shadow-lg transition ease-in-out", "data-[state=open]:animate-in data-[state=open]:duration-500", "data-[state=closed]:animate-out data-[state=closed]:duration-300"), {
	variants: {
		direction: {
			right: "inset-y-0 right-0 h-full border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
			left: "inset-y-0 left-0 h-full border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
			top: "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
			bottom: "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
		},
		size: {
			sm: "",
			md: "",
			lg: "",
			xl: "",
			"2xl": "",
			full: ""
		}
	},
	compoundVariants: [
		{
			direction: ["right", "left"],
			size: "sm",
			className: "w-80"
		},
		{
			direction: ["right", "left"],
			size: "md",
			className: "w-[480px]"
		},
		{
			direction: ["right", "left"],
			size: "lg",
			className: "w-[640px]"
		},
		{
			direction: ["right", "left"],
			size: "xl",
			className: "w-[800px]"
		},
		{
			direction: ["right", "left"],
			size: "2xl",
			className: "w-[960px]"
		},
		{
			direction: ["right", "left"],
			size: "full",
			className: "w-screen"
		}
	],
	defaultVariants: {
		direction: "right",
		size: "lg"
	}
});
function Cr({ className: t, size: n, direction: r, children: i, ...a }) {
	let o = e.useContext(vr), l = r ?? o;
	return /* @__PURE__ */ s(br, { children: /* @__PURE__ */ c("div", {
		className: "ai-table-plugin",
		children: [/* @__PURE__ */ s(xr, {}), /* @__PURE__ */ c(fe.Content, {
			"data-slot": "sheet-content",
			className: Q(Sr({
				direction: l,
				size: n
			}), t),
			...a,
			children: [/* @__PURE__ */ c(fe.Close, {
				"data-slot": "sheet-close-button",
				className: "absolute top-4 right-4 z-10 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ s(ue, {}), /* @__PURE__ */ s("span", {
					className: "sr-only",
					children: "关闭"
				})]
			}), /* @__PURE__ */ s("div", {
				className: "flex flex-1 flex-col overflow-hidden",
				children: i
			})]
		})]
	}) });
}
function wr({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "sheet-header",
		className: Q("flex flex-col gap-0.5 p-6 pb-0", e),
		...t
	});
}
function Tr({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "sheet-footer",
		className: Q("mt-auto flex flex-col gap-2 p-6 pt-0", e),
		...t
	});
}
function Er({ className: e, ...t }) {
	return /* @__PURE__ */ s(fe.Title, {
		"data-slot": "sheet-title",
		className: Q("text-lg font-semibold text-foreground", e),
		...t
	});
}
//#endregion
//#region src/components/wms/ColumnSettingsDrawer.tsx
var Dr = [
	{
		tKey: "wms.columnSettings.density.compact",
		tDefault: "紧凑",
		value: "compact"
	},
	{
		tKey: "wms.columnSettings.density.medium",
		tDefault: "中等",
		value: "medium"
	},
	{
		tKey: "wms.columnSettings.density.relaxed",
		tDefault: "宽松",
		value: "relaxed"
	}
];
function Or({ field: e, index: t }) {
	let { t: n } = J(), { attributes: r, listeners: i, setNodeRef: a, transform: o, transition: l, isDragging: u } = Ne({
		id: e.id,
		disabled: !!e.pinned
	});
	return /* @__PURE__ */ c("div", {
		ref: a,
		className: Q("flex items-center gap-2 px-3 py-1.5", e.pinned ? "cursor-default" : "cursor-grab", u && "opacity-30"),
		style: {
			transform: Fe.Transform.toString(o),
			transition: l
		},
		...r,
		...e.pinned ? {} : i,
		children: [
			e.pinned ? /* @__PURE__ */ s(ne, { className: "size-4 shrink-0 text-primary" }) : /* @__PURE__ */ s(A, { className: "size-4 shrink-0 text-muted-foreground" }),
			/* @__PURE__ */ s("span", {
				className: "w-5 text-right text-xs text-muted-foreground",
				children: t + 1
			}),
			/* @__PURE__ */ s("span", {
				className: "flex-1 truncate text-sm text-foreground",
				children: e.label
			}),
			e.pinned && /* @__PURE__ */ s("span", {
				className: "text-xs text-muted-foreground",
				children: n("wms.columnSettings.pinned", "固定")
			})
		]
	});
}
function kr({ open: e, onOpenChange: t, fields: i, state: o, defaultState: l, onApply: u }) {
	let { t: d } = J(), [f, p] = a(o), [h, g] = a(null), _ = Ae(K(G, { activationConstraint: { distance: 5 } }));
	n(() => {
		e && (p(o), g(null));
	}, [e, o]);
	let v = r(() => hr(f, i, f.density), [f, i]), y = r(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of i) {
			let n = t.group ?? d("wms.columnSettings.groupOther", "其他"), r = e.get(n) ?? [];
			r.push(t), e.set(n, r);
		}
		return Array.from(e.entries()).map(([e, t]) => ({
			group: e,
			items: t
		}));
	}, [i, d]), b = r(() => new Map(i.map((e) => [e.id, e])), [i]), x = new Set(v.visible), S = v.order.filter((e) => x.has(e));
	function C(e) {
		p(hr(e, i, e.density));
	}
	function w(e, t) {
		C({
			...v,
			visible: t ? [...v.visible, e] : v.visible.filter((t) => t !== e)
		});
	}
	function T(e) {
		g(e.active.id);
	}
	function E(e) {
		let { active: t, over: n } = e;
		if (g(null), !n || t.id === n.id || b.get(t.id)?.pinned || b.get(n.id)?.pinned) return;
		let r = v.order.indexOf(t.id), i = v.order.indexOf(n.id);
		r === -1 || i === -1 || C({
			...v,
			order: Me(v.order, r, i)
		});
	}
	function D() {
		p(l);
	}
	function O() {
		u(v), t(!1);
	}
	return /* @__PURE__ */ s(yr, {
		open: e,
		onOpenChange: t,
		direction: "right",
		children: /* @__PURE__ */ c(Cr, {
			size: "xl",
			className: "flex flex-col gap-0 bg-card p-0",
			children: [
				/* @__PURE__ */ s(wr, {
					className: "flex-row items-center justify-between border-b border-border px-6 py-4",
					children: /* @__PURE__ */ s(Er, {
						className: "text-base",
						children: d("wms.columnSettings.title", "列设置")
					})
				}),
				/* @__PURE__ */ c("div", {
					className: "flex shrink-0 items-center gap-3 border-b border-border bg-muted/30 px-6 py-3",
					children: [/* @__PURE__ */ s("span", {
						className: "text-xs text-muted-foreground",
						children: d("wms.columnSettings.rowHeight", "表格行高")
					}), /* @__PURE__ */ s("div", {
						className: "flex items-center gap-0.5",
						children: Dr.map((e) => /* @__PURE__ */ s($, {
							size: "sm",
							variant: v.density === e.value ? "default" : "outline",
							className: "h-7 px-3 text-xs",
							onClick: () => C({
								...v,
								density: e.value
							}),
							children: d(e.tKey, e.tDefault)
						}, e.value))
					})]
				}),
				/* @__PURE__ */ c("div", {
					className: "flex min-h-0 flex-1 overflow-hidden",
					children: [/* @__PURE__ */ s("div", {
						className: "flex-1 overflow-y-auto border-r border-border px-6 py-4",
						children: y.map((e) => {
							let t = e.items.filter((e) => !e.required).map((e) => e.id), n = t.length > 0 && t.every((e) => x.has(e));
							return /* @__PURE__ */ c("section", {
								className: "mb-5 last:mb-0",
								children: [/* @__PURE__ */ c("div", {
									className: "mb-3 flex items-center gap-2",
									children: [
										/* @__PURE__ */ s("span", { className: "inline-block size-2 rounded-full bg-muted-foreground/30" }),
										/* @__PURE__ */ s("span", {
											className: "text-sm font-medium text-foreground",
											children: e.group
										}),
										t.length > 0 && /* @__PURE__ */ s("button", {
											type: "button",
											className: "text-xs text-primary hover:underline",
											onClick: () => {
												let e = new Set(v.visible);
												t.forEach((t) => {
													n ? e.delete(t) : e.add(t);
												}), C({
													...v,
													visible: Array.from(e)
												});
											},
											children: n ? d("wms.columnSettings.unselectAll", "取消全选") : d("wms.columnSettings.selectAll", "全选")
										})
									]
								}), /* @__PURE__ */ s("div", {
									className: "grid gap-2 lg:grid-cols-2",
									children: e.items.map((e) => {
										let t = x.has(e.id);
										return /* @__PURE__ */ c("label", {
											className: Q("flex items-center gap-2 rounded-md border p-2", t ? "border-primary/30 bg-primary/5" : "border-border bg-background", e.required ? "cursor-default" : "cursor-pointer"),
											children: [
												/* @__PURE__ */ s(Bn, {
													checked: t,
													disabled: e.required,
													onCheckedChange: (t) => w(e.id, !!t)
												}),
												/* @__PURE__ */ s("span", {
													className: "flex-1 truncate text-sm text-foreground",
													children: e.label
												}),
												e.required && /* @__PURE__ */ s("span", {
													className: "text-xs text-muted-foreground",
													children: d("wms.columnSettings.required", "必选")
												})
											]
										}, e.id);
									})
								})]
							}, e.group);
						})
					}), /* @__PURE__ */ c("div", {
						className: "flex w-52 shrink-0 flex-col border-l border-border",
						children: [/* @__PURE__ */ c("div", {
							className: "border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ c("span", {
								className: "text-xs font-medium text-foreground",
								children: [
									d("wms.columnSettings.selected", "已选"),
									" (",
									S.length,
									")"
								]
							}), /* @__PURE__ */ s("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: d("wms.columnSettings.dragHint", "拖拽调整列顺序")
							})]
						}), /* @__PURE__ */ s("div", {
							className: "flex-1 overflow-y-auto py-2",
							children: /* @__PURE__ */ c(De, {
								sensors: _,
								collisionDetection: ke,
								onDragStart: T,
								onDragEnd: E,
								children: [/* @__PURE__ */ s(je, {
									items: S,
									strategy: Pe,
									children: S.map((e, t) => {
										let n = b.get(e);
										return n ? /* @__PURE__ */ s(Or, {
											field: n,
											index: t
										}, e) : null;
									})
								}), /* @__PURE__ */ s(Oe, {
									dropAnimation: null,
									children: h ? /* @__PURE__ */ c("div", {
										className: "flex cursor-grabbing items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 shadow-md",
										children: [
											/* @__PURE__ */ s(A, { className: "size-4 shrink-0 text-muted-foreground" }),
											/* @__PURE__ */ s("span", {
												className: "w-5 text-right text-xs text-muted-foreground",
												children: S.indexOf(h) + 1
											}),
											/* @__PURE__ */ s("span", {
												className: "flex-1 truncate text-sm text-foreground",
												children: b.get(h)?.label
											})
										]
									}) : null
								})]
							})
						})]
					})]
				}),
				/* @__PURE__ */ c(Tr, {
					className: "flex-row items-center justify-between gap-2 border-t border-border p-4",
					children: [/* @__PURE__ */ c($, {
						variant: "outline",
						size: "sm",
						onClick: D,
						children: [/* @__PURE__ */ s(L, { className: "size-3.5" }), d("wms.columnSettings.restoreDefault", "恢复默认")]
					}), /* @__PURE__ */ c("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ s($, {
							variant: "outline",
							size: "sm",
							onClick: () => t(!1),
							children: d("wms.columnSettings.cancel", "取消")
						}), /* @__PURE__ */ c($, {
							size: "sm",
							onClick: O,
							children: [/* @__PURE__ */ s(m, { className: "size-3.5" }), d("wms.columnSettings.save", "保存")]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function Ar({ ...e }) {
	return /* @__PURE__ */ s(pe.Root, {
		"data-slot": "dropdown-menu",
		...e
	});
}
function jr({ ...e }) {
	return /* @__PURE__ */ s(pe.Trigger, {
		"data-slot": "dropdown-menu-trigger",
		...e
	});
}
function Mr({ className: e, align: t = "start", sideOffset: n = 4, portalled: r = !0, ...i }) {
	let a = /* @__PURE__ */ s(pe.Content, {
		"data-slot": "dropdown-menu-content",
		sideOffset: n,
		align: t,
		className: Q("z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
		...i
	});
	return r ? /* @__PURE__ */ s(pe.Portal, { children: /* @__PURE__ */ s("div", {
		className: "ai-table-plugin",
		children: a
	}) }) : a;
}
function Nr({ className: e, children: t, checked: n, inset: r, ...i }) {
	return /* @__PURE__ */ c(pe.CheckboxItem, {
		"data-slot": "dropdown-menu-checkbox-item",
		"data-inset": r,
		className: Q("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		checked: n,
		...i,
		children: [/* @__PURE__ */ s("span", {
			className: "pointer-events-none absolute right-2 flex items-center justify-center",
			"data-slot": "dropdown-menu-checkbox-item-indicator",
			children: /* @__PURE__ */ s(pe.ItemIndicator, { children: /* @__PURE__ */ s(g, {}) })
		}), t]
	});
}
//#endregion
//#region src/components/ui/label.tsx
function Pr({ className: e, ...t }) {
	return /* @__PURE__ */ s(me.Root, {
		"data-slot": "label",
		className: Q("flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
		...t
	});
}
//#endregion
//#region src/components/ui/skeleton.tsx
function Fr({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "skeleton",
		className: Q("animate-pulse rounded-md bg-accent", e),
		...t
	});
}
//#endregion
//#region src/components/ui/table.tsx
function Ir({ className: e, ...t }) {
	return /* @__PURE__ */ s("div", {
		"data-slot": "table-container",
		className: "relative w-full min-w-0 max-w-full overflow-x-auto",
		children: /* @__PURE__ */ s("table", {
			"data-slot": "table",
			className: Q("w-full caption-bottom text-sm", e),
			...t
		})
	});
}
function Lr({ className: e, ...t }) {
	return /* @__PURE__ */ s("thead", {
		"data-slot": "table-header",
		className: Q("[&_tr]:border-b", e),
		...t
	});
}
function Rr({ className: e, ...t }) {
	return /* @__PURE__ */ s("tbody", {
		"data-slot": "table-body",
		className: Q("[&_tr:last-child]:border-0", e),
		...t
	});
}
function zr({ className: e, ...t }) {
	return /* @__PURE__ */ s("tr", {
		"data-slot": "table-row",
		className: Q("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50", e),
		...t
	});
}
function Br({ className: e, ...t }) {
	return /* @__PURE__ */ s("th", {
		"data-slot": "table-head",
		className: Q("h-10 px-2 text-left align-middle text-sm font-medium text-foreground whitespace-nowrap", "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
function Vr({ className: e, ...t }) {
	return /* @__PURE__ */ s("td", {
		"data-slot": "table-cell",
		className: Q("p-2 align-middle whitespace-nowrap", "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/tabs.tsx
function Hr({ className: e, orientation: t = "horizontal", ...n }) {
	return /* @__PURE__ */ s(ve.Root, {
		"data-slot": "tabs",
		"data-orientation": t,
		className: Q("group/tabs flex gap-2 data-horizontal:flex-col", e),
		...n
	});
}
var Ur = de("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function Wr({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ s(ve.List, {
		"data-slot": "tabs-list",
		"data-variant": t,
		className: Q(Ur({ variant: t }), e),
		...n
	});
}
function Gr({ className: e, ...t }) {
	return /* @__PURE__ */ s(ve.Trigger, {
		"data-slot": "tabs-trigger",
		className: Q("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent", "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", e),
		...t
	});
}
//#endregion
//#region src/components/wms/DataTable.tsx
function Kr(e) {
	return [{
		id: "__select__",
		header: ({ table: e }) => /* @__PURE__ */ s(Bn, {
			checked: e.getIsAllPageRowsSelected() ? !0 : e.getIsSomePageRowsSelected() ? "indeterminate" : !1,
			onCheckedChange: (t) => e.toggleAllPageRowsSelected(!!t),
			"aria-label": "全选"
		}),
		cell: ({ row: e }) => /* @__PURE__ */ s(Bn, {
			checked: e.getIsSelected(),
			onCheckedChange: (t) => e.toggleSelected(!!t),
			disabled: !e.getCanSelect(),
			"aria-label": "选择行"
		}),
		enableSorting: !1,
		enableHiding: !1,
		size: 40
	}, ...e];
}
var qr = /* @__PURE__ */ new Set(["__select__", "__index__"]);
function Jr(e) {
	return qr.has(e);
}
function Yr({ columns: t, data: n, total: r, page: i, pageSize: a, onPageChange: f, serverSorting: p, onServerSortingChange: m, onPageSizeChange: h, pageSizeOptions: g = [
	10,
	20,
	50,
	100
], tabs: _, activeTab: x, onTabChange: S, onRowSelectionChange: w, rowSelection: E, getRowId: O, getRowCanSelect: k, loading: A = !1, onRefresh: j, emptyText: M = "暂无数据", toolbar: N, batchActions: P, columnSettings: F, showColumnControls: ee = !0, fillWidth: te = !1, rowClassName: ne, rowStyle: I, cellClassName: L, cellStyle: z, columnStyle: ie, groups: B, onGroupToggle: ae, frozenLeftColumnIds: oe, onFrozenColumnCountChange: V, minFrozenColumnCount: se, scopeNote: ce, belowToolbar: le, viewToolbar: ue, viewStatus: de, onColumnSettingsStateChange: H }) {
	let { t: U } = J(), [fe, pe] = e.useState([]), [me] = e.useState([]), [he, ge] = e.useState({}), [W, _e] = e.useState({}), ve = E ?? W, [ye, be] = e.useState(!1), [xe, De] = e.useState(() => /* @__PURE__ */ new Map()), Oe = Object.keys(ve).length, G = !!F, ke = e.useMemo(() => G ? t.filter((e) => {
		let t = e.id ?? ("accessorKey" in e ? String(e.accessorKey) : void 0), n = e.meta?.sticky === "right";
		return t && !Jr(t) && t !== "actions" && !n;
	}).map((e, t) => {
		let n = String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")), r = typeof e.header == "string" ? e.header : n, i = F?.fieldOverrides?.[n];
		return {
			id: n,
			label: i?.label ?? r,
			group: i?.group,
			required: e.enableHiding === !1,
			defaultVisible: i?.defaultVisible,
			...t === 0 ? { pinned: !0 } : {}
		};
	}) : [], [
		t,
		G,
		F
	]), K = _r({
		storageKey: F?.storageKey ?? "__noop__",
		fields: G ? ke : []
	});
	e.useEffect(() => {
		H?.(K.state);
	}, [K.state, H]);
	let Ae = G ? K.columnVisibility : he, je = e.useMemo(() => {
		if (!G) return [];
		let e = t.map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""))).filter((e) => Jr(e)), n = t.filter((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === "actions" || e.meta?.sticky === "right").map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")));
		return [
			...e,
			...K.state.order.filter((e) => !Jr(e) && !n.includes(e)),
			...n
		];
	}, [
		G,
		t,
		K.state.order
	]), Me = e.useMemo(() => je.length ? je : t.map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""))), [t, je]), Ne = e.useMemo(() => {
		let e = new Map(t.map((e) => [String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")), e]));
		return Me.filter((t) => {
			let n = e.get(t), r = n?.meta?.sticky === "right";
			return !!n && !Jr(t) && t !== "actions" && !r && Ae[t] !== !1;
		});
	}, [
		t,
		Me,
		Ae
	]), Pe = oe?.length ?? 0, Fe = Math.max(0, Ne.length - 1), q = Ne.slice(0, Math.min(Pe, Fe)), Ie = e.useMemo(() => new Set(q), [q]), Le = e.useMemo(() => {
		let e = /* @__PURE__ */ new Map(), n = 0;
		for (let r of Me) {
			let i = t.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === r);
			!i || Ae[r] === !1 || (Jr(r) && V ? (e.set(r, n), n += xe.get(r) ?? i.size ?? 40) : Ie.has(r) && (e.set(r, n), n += xe.get(r) ?? i.size ?? 150));
		}
		return e;
	}, [
		t,
		Me,
		Ae,
		Ie,
		V,
		xe
	]), Re = q.length > 0, Y = Ie, ze = !!B && B.length > 0, Be = e.useMemo(() => {
		if (!ze || !B) return [];
		let e = [];
		function t(n) {
			for (let r of n) if (e.push({
				type: "groupHeader",
				group: r
			}), !r.collapsed) if (r.children && r.children.length > 0) t(r.children);
			else for (let t of r.rows) {
				let n = O ? O(t) : String(e.length);
				e.push({
					type: "dataRow",
					rowId: n,
					data: t
				});
			}
		}
		return t(B), e;
	}, [
		ze,
		B,
		O
	]), Ve = e.useRef(null), He = e.useRef(null), Ue = e.useRef(null), We = e.useRef(null), [Ge, Ke] = e.useState(!1), [qe, Je] = e.useState(!1), [Ye, Xe] = e.useState(!1), Ze = e.useRef(null), Qe = !!Re || !!V, $e = Ge || qe || Ye, et = e.useMemo(() => {
		if (!V) return null;
		let e = null;
		for (let n of t) {
			let t = String(n.id ?? ("accessorKey" in n ? n.accessorKey : ""));
			Jr(t) && (e = t);
		}
		return e;
	}, [t, V]), tt = q.length ? q[q.length - 1] : et;
	e.useEffect(() => {
		let e = He.current;
		if (!e) return;
		let t = () => {
			let t = /* @__PURE__ */ new Map();
			e.querySelectorAll("thead th[data-col-id]").forEach((e) => {
				let n = e.getBoundingClientRect().width;
				n > 0 && t.set(e.dataset.colId, n);
			}), De((e) => e.size === t.size && [...t].every(([t, n]) => Math.abs((e.get(t) ?? 0) - n) < .5) ? e : t);
		};
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		n.observe(e);
		let r = e.querySelector("table");
		return r && n.observe(r), e.querySelectorAll("thead th[data-col-id]").forEach((e) => n.observe(e)), () => n.disconnect();
	}, [
		t,
		Me,
		Ae
	]);
	let nt = e.useMemo(() => {
		let e = 0;
		for (let n of Me) {
			let r = t.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n);
			!r || Ae[n] === !1 || (Jr(n) && V ? e += xe.get(n) ?? r.size ?? 40 : Y.has(n) && (e += xe.get(n) ?? r.size ?? 150));
		}
		return e;
	}, [
		t,
		Me,
		Ae,
		Y,
		V,
		xe
	]);
	function rt(e) {
		let n = He.current;
		if (!n) return null;
		let r = n.getBoundingClientRect(), i = e - r.left + n.scrollLeft, a = Array.from(n.querySelectorAll("thead th")), o = a.find((e) => e.dataset.colId === "__select__"), s = a.filter((e) => {
			let n = e.dataset.colId;
			return !n || n === "__select__" || n === "actions" ? !1 : t.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n)?.meta?.sticky !== "right";
		}), c = a.find((e) => {
			let n = e.dataset.colId;
			return n === "actions" || t.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n)?.meta?.sticky === "right";
		}), l = c ? c.getBoundingClientRect().left - r.left : n.clientWidth, u = n.scrollLeft + l, d = Math.max(0, Math.min(s.length - 1, s.filter((e) => e.offsetLeft + e.offsetWidth <= u).length)), f = Math.min(se ?? 0, d), p = 0, m = o ? o.offsetLeft + o.offsetWidth : 0;
		for (let e of s) {
			if (p >= d) break;
			if (i >= e.offsetLeft + e.offsetWidth / 2) p += 1, m = e.offsetLeft + e.offsetWidth;
			else break;
		}
		if (p < f) {
			p = f;
			let e = s[p - 1];
			e && (m = e.offsetLeft + e.offsetWidth);
		}
		let h = f >= 1 ? s[f - 1] : void 0, g = d > 0 ? s[d - 1] : void 0, _ = g ? g.getBoundingClientRect().right - r.left : o ? o.getBoundingClientRect().right - r.left : 0, v = h ? h.getBoundingClientRect().right - r.left : o ? o.getBoundingClientRect().right - r.left : 0;
		return {
			count: p,
			snapX: m - n.scrollLeft,
			minimumX: v,
			maximumX: Math.max(v, Math.min(n.clientWidth, _, l))
		};
	}
	function it(e, t) {
		let n = Ve.current, r = He.current, i = Ue.current, a = We.current;
		if (!n || !r) return;
		let o = rt(e.clientX), s = r.getBoundingClientRect(), c = n.getBoundingClientRect(), l = e.clientX - s.left, u = Math.min(Math.max(l, o?.minimumX ?? 0), o?.maximumX ?? r.clientWidth);
		if (t && i && (i.style.left = `${u}px`), a) {
			let t = a.offsetWidth || 150, r = u + 14, i = r + t <= n.clientWidth - 8 ? r : Math.max(8, u - t - 14), o = Math.min(Math.max(e.clientY - c.top - 15, 8), Math.max(8, n.clientHeight - 38));
			a.style.left = `${i}px`, a.style.top = `${o}px`;
		}
	}
	function at(e) {
		if (!V) return;
		e.preventDefault(), e.stopPropagation(), e.currentTarget.setPointerCapture(e.pointerId);
		let t = e.currentTarget, n = e.pointerId;
		Ke(!0), it(e.nativeEvent, !0);
		let r = rt(e.clientX);
		Ze.current = r ? {
			count: r.count,
			snapX: r.snapX
		} : {
			count: q.length,
			snapX: nt
		};
		let i = document.body.style.cursor, a = document.body.style.userSelect;
		document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
		let o = (e) => {
			let t = rt(e.clientX);
			t && (Ze.current = {
				count: t.count,
				snapX: t.snapX
			}), it(e, !0);
		}, s = (e) => {
			document.removeEventListener("pointermove", o), document.removeEventListener("pointerup", s), document.removeEventListener("pointercancel", s), document.body.style.cursor = i, document.body.style.userSelect = a, t.hasPointerCapture(n) && t.releasePointerCapture(n), Ke(!1), Je(!1);
			let r = rt(e.clientX);
			r && (Ze.current = {
				count: r.count,
				snapX: r.snapX
			});
			let c = Ze.current?.count ?? q.length;
			Ue.current && (Ue.current.style.left = `${Ze.current?.snapX ?? nt}px`), Ze.current = null, V(c);
		};
		document.addEventListener("pointermove", o), document.addEventListener("pointerup", s), document.addEventListener("pointercancel", s);
	}
	function ot(e) {
		if (!V || ![
			"ArrowLeft",
			"ArrowRight",
			"Home"
		].includes(e.key)) return;
		e.preventDefault();
		let t = q.length;
		e.key === "Home" ? V(0) : V(t + (e.key === "ArrowRight" ? 1 : -1));
	}
	let st = Math.max(1, Math.ceil(r / a)), X = Ee({
		data: n,
		columns: t,
		getRowId: O,
		state: {
			sorting: p ?? fe,
			columnFilters: me,
			columnVisibility: Ae,
			columnOrder: je,
			rowSelection: ve
		},
		manualPagination: !0,
		pageCount: st,
		enableRowSelection: k ? (e) => k(e.original) : !0,
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(ve) : e;
			E === void 0 && _e(t), w?.(t);
		},
		onSortingChange: (e) => {
			if (!m) {
				pe(e);
				return;
			}
			m(typeof e == "function" ? e(p ?? []) : e);
		},
		manualSorting: p !== void 0,
		onColumnVisibilityChange: G ? void 0 : ge,
		getCoreRowModel: Ce(),
		getFilteredRowModel: we(),
		getSortedRowModel: Te()
	}), ct = X.getVisibleLeafColumns(), lt = Re ? (() => {
		let e = [];
		for (let t of ct) {
			let n = String(t.id);
			if (!(Y.has(n) || Jr(n) && V)) break;
			e.push(t);
		}
		return e;
	})() : [], ut = lt.length, dt = lt.reduce((e, t) => e + t.getSize(), 0), ft = ct.length - ut;
	function pt(e) {
		E === void 0 && _e({}), S?.(e);
	}
	let mt = e.useRef({}), ht = e.useRef(void 0);
	if (ht.current === x) for (let e of _ ?? []) e.count !== void 0 && (mt.current[e.value] = e.count);
	ht.current = x;
	let gt = (_ ?? []).map((e) => ({
		...e,
		count: mt.current[e.value] ?? e.count
	}));
	function _t(e, t, n, r = "") {
		let i = !!Re && Y.has(t) || Jr(t) && !!V, a = Le.get(t) ?? 0, o = L?.(e, t) ?? "", s = z?.(e, t), c = I?.(e);
		return {
			cellClass: [
				n ? "sticky right-0 z-10 bg-card shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)] has-[button[data-state=open]]:z-30" : "",
				i ? "sticky z-10 bg-card" : "",
				n || i ? r : "",
				i && t === tt ? "shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]" : "",
				o
			].filter(Boolean).join(" "),
			cellStyle: {
				...i ? { left: a } : {},
				...i || n ? { backgroundColor: "var(--card)" } : {},
				...i || n ? c : {},
				...s
			}
		};
	}
	let vt = gt.length > 0 ? /* @__PURE__ */ s(Hr, {
		value: x,
		onValueChange: pt,
		children: /* @__PURE__ */ s(Wr, {
			className: "h-8",
			children: gt.map((e) => /* @__PURE__ */ c(Gr, {
				value: e.value,
				className: "gap-1.5 px-3 text-xs",
				children: [e.label, e.count !== void 0 && /* @__PURE__ */ s(zn, {
					variant: "secondary",
					className: "h-4 rounded-full px-1 text-[10px] font-medium",
					children: e.count
				})]
			}, e.value))
		})
	}) : null, yt = P ? /* @__PURE__ */ s("div", {
		className: "flex items-center gap-2",
		children: P
	}) : null, bt = Oe > 0 ? /* @__PURE__ */ s("span", {
		className: "whitespace-nowrap text-sm text-muted-foreground",
		children: U("wms.selectedCount", { count: Oe })
	}) : null, xt = j ? /* @__PURE__ */ s($, {
		type: "button",
		variant: "ghost",
		size: "icon",
		className: "size-8 text-muted-foreground",
		"aria-label": U("common.refresh", "刷新"),
		title: U("common.refresh", "刷新"),
		disabled: A,
		onClick: () => void j(),
		children: /* @__PURE__ */ s(re, { className: `size-4${A ? " animate-spin" : ""}` })
	}) : null, St = ee ? G ? /* @__PURE__ */ c($, {
		variant: "outline",
		size: "sm",
		onClick: () => be(!0),
		children: [/* @__PURE__ */ s(R, { className: "size-4" }), U("wms.columnSettings.title", "列设置")]
	}) : /* @__PURE__ */ c(Ar, { children: [/* @__PURE__ */ s(jr, {
		asChild: !0,
		children: /* @__PURE__ */ c($, {
			variant: "outline",
			size: "sm",
			children: [
				/* @__PURE__ */ s(D, { className: "size-4" }),
				U("wms.column", "列"),
				/* @__PURE__ */ s(v, { className: "size-3.5 opacity-60" })
			]
		})
	}), /* @__PURE__ */ s(Mr, {
		align: "end",
		className: "min-w-36",
		children: X.getAllColumns().filter((e) => e.getCanHide()).map((e) => /* @__PURE__ */ s(Nr, {
			checked: e.getIsVisible(),
			onCheckedChange: (t) => e.toggleVisibility(!!t),
			children: typeof e.columnDef.header == "string" ? e.columnDef.header : e.id
		}, e.id))
	})] }) : null, Ct = /* @__PURE__ */ c(o, { children: [
		xt,
		N,
		St
	] }), wt = !!(vt || yt || xt || N || St || !ue && bt);
	return /* @__PURE__ */ c("div", {
		className: "flex w-full flex-col gap-0",
		children: [
			ue ? /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ c("div", {
				role: "toolbar",
				"aria-label": "智能表格视图操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto px-4 py-2.5 lg:px-6",
				children: [/* @__PURE__ */ s("div", {
					className: "flex min-w-max items-center gap-2",
					children: typeof ue == "function" ? ue({
						openColumnSettings: () => be(!0),
						selectedCount: Oe
					}) : ue
				}), de ? /* @__PURE__ */ s("div", {
					className: "flex min-w-max items-center gap-2",
					children: de
				}) : null]
			}), wt ? /* @__PURE__ */ c("div", {
				role: "toolbar",
				"aria-label": "业务数据操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto border-t bg-muted/10 px-4 py-2.5 lg:px-6",
				children: [/* @__PURE__ */ c("div", {
					className: "flex min-w-max items-center gap-3",
					children: [vt, yt]
				}), /* @__PURE__ */ s("div", {
					className: "flex min-w-max items-center gap-2",
					children: Ct
				})]
			}) : null] }) : /* @__PURE__ */ c("div", {
				role: "toolbar",
				"aria-label": "业务数据操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto px-4 py-3 lg:px-6",
				children: [/* @__PURE__ */ c("div", {
					className: "flex min-w-max items-center gap-3",
					children: [
						bt,
						vt,
						yt
					]
				}), /* @__PURE__ */ s("div", {
					className: "flex min-w-max items-center gap-2",
					children: Ct
				})]
			}),
			le && /* @__PURE__ */ s("div", {
				className: "border-t",
				children: le
			}),
			ce && /* @__PURE__ */ s("div", {
				className: "border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground lg:px-6",
				children: ce
			}),
			/* @__PURE__ */ c("div", {
				ref: Ve,
				className: "relative border-t",
				children: [!A && Qe ? /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ c("div", {
					ref: Ue,
					role: "separator",
					"aria-label": U("wms.freeze.dragLabel", "拖拽调整左侧冻结列"),
					"aria-orientation": "vertical",
					"aria-valuemin": se ?? 0,
					"aria-valuenow": q.length,
					"aria-describedby": "freeze-column-drag-tooltip",
					tabIndex: 0,
					className: `group absolute inset-y-0 z-30 flex w-3 -translate-x-1/2 cursor-col-resize touch-none items-start justify-center outline-none transition-colors hover:text-primary ${$e ? "text-primary" : "text-border"}`,
					style: { left: nt },
					onPointerDown: at,
					onPointerEnter: (e) => {
						it(e.nativeEvent, !1), Je(!0);
					},
					onPointerMove: (e) => {
						it(e.nativeEvent, Ge), Je(!0);
					},
					onPointerLeave: () => {
						Ge || Je(!1);
					},
					onFocus: () => Xe(!0),
					onBlur: () => Xe(!1),
					onKeyDown: ot,
					children: [/* @__PURE__ */ s("span", { className: "h-full w-px bg-current transition-colors" }), /* @__PURE__ */ s("span", {
						className: `absolute top-8 flex h-7 w-3 items-center justify-center rounded-full bg-primary shadow-sm ring-primary/25 transition-all group-hover:scale-100 group-hover:opacity-100 ${$e ? "scale-100 opacity-100" : "scale-90 opacity-0"} ${Ye ? "ring-4" : ""}`,
						children: /* @__PURE__ */ s("span", { className: "h-3 w-px bg-primary-foreground/90" })
					})]
				}), /* @__PURE__ */ s("div", {
					ref: We,
					id: "freeze-column-drag-tooltip",
					role: "tooltip",
					className: `pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md transition-opacity ${qe || Ge ? "opacity-100" : "opacity-0"}`,
					style: {
						left: nt + 14,
						top: 8
					},
					children: U("wms.freeze.tooltip", "拖拽可调整冻结区域")
				})] }) : null, /* @__PURE__ */ s("div", {
					ref: He,
					className: `w-full min-w-0 overflow-x-auto${Qe ? " [&>[data-slot=table-container]]:overflow-visible" : ""}`,
					"data-density": G ? K.density : void 0,
					children: A ? /* @__PURE__ */ c("div", { children: [/* @__PURE__ */ s("div", {
						className: "flex items-center gap-2 border-b bg-muted/60 px-2 py-2.5",
						children: Array.from({ length: Math.min(t.length, 6) }).map((e, t) => /* @__PURE__ */ s(Fr, {
							className: "h-3.5",
							style: { width: `${60 + t * 37 % 80}px` }
						}, t))
					}), Array.from({ length: a > 8 ? 8 : a }).map((e, n) => /* @__PURE__ */ s("div", {
						className: `flex items-center gap-2 border-b px-2 py-2 ${n % 2 == 0 ? "bg-muted/20" : ""}`,
						children: Array.from({ length: Math.min(t.length, 6) }).map((e, t) => /* @__PURE__ */ s(Fr, {
							className: "h-3.5",
							style: { width: `${40 + (n * 13 + t * 29) % 80}px` }
						}, t))
					}, n))] }) : /* @__PURE__ */ c(Ir, {
						className: "table-fixed",
						style: {
							minWidth: X.getTotalSize(),
							width: te ? "100%" : X.getTotalSize()
						},
						children: [/* @__PURE__ */ s(Lr, {
							className: "sticky top-0 z-10 bg-muted",
							children: X.getHeaderGroups().map((e) => /* @__PURE__ */ s(zr, { children: e.headers.map((e) => {
								let t = String(e.column.id), n = e.column.columnDef.meta?.sticky === "right", r = !!Re && Y.has(t) || Jr(t) && !!V, i = Le.get(t) ?? 0, a = n ? "sticky right-0 z-20 bg-muted shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)]" : r ? `sticky z-20 bg-muted${t === tt ? " shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]" : ""}` : "", o = {
									width: e.getSize(),
									minWidth: e.getSize(),
									maxWidth: e.getSize(),
									...r ? { left: i } : {},
									...ie?.(t)
								};
								return /* @__PURE__ */ s(Br, {
									colSpan: e.colSpan,
									style: o,
									className: a,
									"data-col-id": t,
									"aria-sort": e.column.getIsSorted() === "asc" ? "ascending" : e.column.getIsSorted() === "desc" ? "descending" : "none",
									children: e.isPlaceholder ? null : p !== void 0 && e.column.getCanSort() ? /* @__PURE__ */ c("button", {
										type: "button",
										className: "flex w-full items-center justify-between gap-2 text-left",
										onClick: e.column.getToggleSortingHandler(),
										"aria-label": `按${String(e.column.columnDef.header ?? t)}排序`,
										children: [Se(e.column.columnDef.header, e.getContext()), e.column.getIsSorted() === "asc" ? /* @__PURE__ */ s(u, {
											className: "size-3.5 shrink-0",
											"aria-hidden": "true"
										}) : e.column.getIsSorted() === "desc" ? /* @__PURE__ */ s(l, {
											className: "size-3.5 shrink-0",
											"aria-hidden": "true"
										}) : /* @__PURE__ */ s(d, {
											className: "size-3.5 shrink-0 opacity-50",
											"aria-hidden": "true"
										})]
									}) : Se(e.column.columnDef.header, e.getContext())
								}, e.id);
							}) }, e.id))
						}), /* @__PURE__ */ s(Rr, { children: ze ? Be.length === 0 ? /* @__PURE__ */ s(zr, { children: /* @__PURE__ */ s(Vr, {
							colSpan: t.length,
							className: "h-24 text-center text-muted-foreground",
							children: M
						}) }) : Be.map((e) => {
							if (e.type === "groupHeader") {
								let t = e.group.rows.filter((e) => !k || k(e)).map((e) => O ? O(e) : String(n.indexOf(e))).filter((e) => e !== "-1"), r = t.filter((e) => !!ve[e]).length, i = t.length > 0 && r === t.length || r > 0 && "indeterminate", a = /* @__PURE__ */ c("div", {
									className: "flex min-w-0 items-center gap-1.5",
									style: { paddingLeft: e.group.depth * 16 },
									children: [
										/* @__PURE__ */ s(Bn, {
											checked: i,
											disabled: t.length === 0,
											onCheckedChange: (e) => {
												let n = e === !0;
												X.setRowSelection((e) => {
													let r = { ...e };
													for (let e of t) n ? r[e] = !0 : delete r[e];
													return r;
												});
											},
											"aria-label": U("wms.group.selectRows", {
												label: e.group.label,
												count: t.length
											})
										}),
										/* @__PURE__ */ s("button", {
											type: "button",
											className: "flex size-4 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground",
											"aria-label": `${e.group.collapsed ? "展开" : "折叠"}分组 ${e.group.label}`,
											onClick: () => ae?.(e.group.key),
											children: /* @__PURE__ */ s("svg", {
												"aria-hidden": "true",
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												style: {
													display: "block",
													flex: "0 0 16px",
													height: 16,
													width: 16
												},
												children: /* @__PURE__ */ s("path", { d: e.group.collapsed ? "m9 18 6-6-6-6" : "m6 9 6 6 6-6" })
											})
										}),
										/* @__PURE__ */ s("span", {
											className: "truncate text-sm font-semibold",
											children: e.group.label
										}),
										/* @__PURE__ */ c("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: [
												"(",
												e.group.count,
												")"
											]
										})
									]
								});
								return /* @__PURE__ */ s(zr, {
									className: "bg-muted/40 hover:bg-muted/40",
									children: ut > 0 ? /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ s(Vr, {
										colSpan: ut,
										className: "sticky left-0 z-20 overflow-hidden bg-muted py-2 font-medium shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]",
										style: {
											width: dt,
											minWidth: dt,
											maxWidth: dt
										},
										children: a
									}), ft > 0 ? /* @__PURE__ */ s(Vr, {
										colSpan: ft,
										className: "bg-muted/40 p-0",
										"aria-hidden": "true"
									}) : null] }) : /* @__PURE__ */ s(Vr, {
										colSpan: ct.length,
										className: "py-2 font-medium",
										children: a
									})
								}, `gh-${e.group.key}`);
							}
							let t = X.getRowModel().rowsById[e.rowId];
							if (!t) return null;
							let r = ne?.(t.original);
							return /* @__PURE__ */ s(zr, {
								"data-state": t.getIsSelected() ? "selected" : void 0,
								className: ["bg-card", r].filter(Boolean).join(" "),
								style: I?.(t.original),
								children: t.getVisibleCells().map((e) => {
									let n = e.getValue(), i = e.column.columnDef.meta?.sticky === "right", { cellClass: a, cellStyle: o } = _t(t.original, String(e.column.id), i, r);
									return /* @__PURE__ */ s(Vr, {
										className: `${a} overflow-hidden text-ellipsis`,
										title: typeof n == "string" || typeof n == "number" ? String(n) : void 0,
										style: {
											...o,
											width: e.column.getSize(),
											minWidth: e.column.getSize(),
											maxWidth: e.column.getSize()
										},
										children: Se(e.column.columnDef.cell, e.getContext())
									}, e.id);
								})
							}, `gr-${e.rowId}`);
						}) : X.getRowModel().rows.length === 0 ? /* @__PURE__ */ s(zr, { children: /* @__PURE__ */ s(Vr, {
							colSpan: t.length,
							className: "h-24 text-center text-muted-foreground",
							children: M
						}) }) : X.getRowModel().rows.map((e) => {
							let t = ne?.(e.original);
							return /* @__PURE__ */ s(zr, {
								"data-state": e.getIsSelected() ? "selected" : void 0,
								className: ["bg-card", t].filter(Boolean).join(" "),
								style: I?.(e.original),
								children: e.getVisibleCells().map((n) => {
									let r = n.getValue(), i = n.column.columnDef.meta?.sticky === "right", { cellClass: a, cellStyle: o } = _t(e.original, String(n.column.id), i, t);
									return /* @__PURE__ */ s(Vr, {
										className: `${a} overflow-hidden text-ellipsis`,
										title: typeof r == "string" || typeof r == "number" ? String(r) : void 0,
										style: {
											...o,
											width: n.column.getSize(),
											minWidth: n.column.getSize(),
											maxWidth: n.column.getSize()
										},
										children: Se(n.column.columnDef.cell, n.getContext())
									}, n.id);
								})
							}, e.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ c("div", {
				className: "flex items-center justify-between border-t px-4 py-3 lg:px-6",
				children: [/* @__PURE__ */ s("div", {
					className: "hidden text-xs text-muted-foreground lg:block",
					children: Object.keys(ve).length > 0 ? U("wms.pagination.selectedRows", {
						selected: Object.keys(ve).length,
						total: r
					}) : U("wms.pagination.totalRecords", { total: r })
				}), /* @__PURE__ */ c("div", {
					className: "flex w-full items-center gap-6 lg:w-auto",
					children: [
						h && /* @__PURE__ */ c("div", {
							className: "hidden items-center gap-2 lg:flex",
							children: [/* @__PURE__ */ s(Pr, {
								htmlFor: "rows-per-page",
								className: "text-xs text-muted-foreground whitespace-nowrap",
								children: U("wms.pagination.rowsPerPage", "每页行数")
							}), /* @__PURE__ */ c(mn, {
								value: String(a),
								onValueChange: (e) => {
									h(Number(e));
								},
								disabled: A,
								children: [/* @__PURE__ */ s(_n, {
									size: "sm",
									className: "w-20",
									id: "rows-per-page",
									children: /* @__PURE__ */ s(gn, {})
								}), /* @__PURE__ */ s(vn, {
									side: "top",
									children: /* @__PURE__ */ s(hn, { children: g.map((e) => /* @__PURE__ */ s(yn, {
										value: String(e),
										children: e
									}, e)) })
								})]
							})]
						}),
						/* @__PURE__ */ s("div", {
							className: "flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap",
							children: U("wms.pagination.pageInfo", {
								page: i,
								total: st
							})
						}),
						/* @__PURE__ */ c("div", {
							className: "ml-auto flex items-center gap-1 lg:ml-0",
							children: [
								/* @__PURE__ */ c($, {
									variant: "outline",
									size: "icon",
									className: "hidden size-7 lg:flex",
									onClick: () => f(1),
									disabled: A || i <= 1,
									children: [/* @__PURE__ */ s("span", {
										className: "sr-only",
										children: U("common.label.firstPage", "首页")
									}), /* @__PURE__ */ s(C, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ c($, {
									variant: "outline",
									size: "icon",
									className: "size-7",
									onClick: () => f(i - 1),
									disabled: A || i <= 1,
									children: [/* @__PURE__ */ s("span", {
										className: "sr-only",
										children: U("common.label.prevPage", "上一页")
									}), /* @__PURE__ */ s(y, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ c($, {
									variant: "outline",
									size: "icon",
									className: "size-7",
									onClick: () => f(i + 1),
									disabled: A || i >= st,
									children: [/* @__PURE__ */ s("span", {
										className: "sr-only",
										children: U("common.label.nextPage", "下一页")
									}), /* @__PURE__ */ s(b, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ c($, {
									variant: "outline",
									size: "icon",
									className: "hidden size-7 lg:flex",
									onClick: () => f(st),
									disabled: A || i >= st,
									children: [/* @__PURE__ */ s("span", {
										className: "sr-only",
										children: U("common.label.lastPage", "末页")
									}), /* @__PURE__ */ s(T, { className: "size-3.5" })]
								})
							]
						})
					]
				})]
			}),
			G && /* @__PURE__ */ s(kr, {
				open: ye,
				onOpenChange: be,
				fields: ke,
				state: K.state,
				defaultState: K.defaultState,
				onApply: K.applyState
			})
		]
	});
}
//#endregion
//#region src/components/ai-table/AITableDataView.tsx
function Xr({ columns: t, tableProps: n, showScopeNote: r = !0, clientPagination: i = !1 }) {
	let { t: a } = J(), [o, c] = e.useState(), { config: l, state: u, rows: d, appliedFields: f, filteredRows: p, sortedRows: m, serverQuery: h, visibleRows: g, totalCount: _, groups: v, rowColors: y, rowMarkerColors: b, cellColors: x, columnColors: S, updateDraft: C, updateSorts: w } = Z(), { savedView: T, draftView: E } = u, D = JSON.stringify([
		T.filters,
		T.sorts,
		T.groups,
		d.length
	]), O = e.useRef(D);
	e.useEffect(() => {
		O.current !== D && (O.current = D, !h && n.page !== 1 && n.onPageChange(1));
	}, [
		h,
		n.onPageChange,
		n.page,
		D
	]);
	let k = Math.max(1, Math.ceil((i ? p.length : _) / n.pageSize)), A = i ? Math.min(Math.max(1, n.page), k) : n.page, j = e.useMemo(() => i ? m.slice((A - 1) * n.pageSize, A * n.pageSize) : g, [
		i,
		A,
		m,
		n.pageSize,
		g
	]), M = e.useMemo(() => i && v.length ? ei(v, new Set(j.map(l.rowKey)), l.rowKey) : v, [
		i,
		l.rowKey,
		v,
		j
	]), N = e.useMemo(() => {
		let e = new Set(t.map($r));
		return f.filter((t) => t.source !== "business" && !e.has(t.fieldId)).sort((e, t) => Number(t.source === "ai") - Number(e.source === "ai")).map((e) => ti(e, l.rowKey));
	}, [
		f,
		t,
		l.rowKey
	]), P = e.useMemo(() => {
		let e = [], n = [];
		for (let r of t) {
			let t = $r(r), i = r.meta?.sticky === "right";
			t === "actions" || i ? n.push(r) : e.push(r);
		}
		let r = e.findIndex((e) => $r(e) === l.dynamicColumnAnchorFieldId);
		return r < 0 ? [
			...e,
			...N,
			...n
		] : [
			...e.slice(0, r + 1),
			...N,
			...e.slice(r + 1),
			...n
		];
	}, [
		t,
		l.dynamicColumnAnchorFieldId,
		N
	]), F = e.useMemo(() => P.map($r).filter((e) => e && e !== "__select__" && e !== "actions"), [P]), ee = e.useMemo(() => {
		let e = new Set(F), t = new Set(o?.visible ?? F), n = o?.order ?? F;
		return [...n.filter((t) => e.has(t)), ...F.filter((e) => !n.includes(e))].filter((e) => t.has(e));
	}, [F, o]), te = it(E.frozenColumnCount, ee.length), ne = ee.slice(0, te), I = e.useCallback((e) => {
		c(e);
	}, []), re = P.some((e) => $r(e) === "__select__") ? "__select__" : F[0], L = e.useCallback((e) => {
		let t = E.collapsedGroupKeys;
		C({ collapsedGroupKeys: t.includes(e) ? t.filter((t) => t !== e) : [...t, e] });
	}, [E.collapsedGroupKeys, C]), R = e.useCallback((e) => {
		let t = T.sorts.map((e) => ({
			id: e.fieldId,
			desc: e.direction === "desc"
		})), n = typeof e == "function" ? e(t) : e;
		w(n.map(({ id: e, desc: t }) => ({
			fieldId: e,
			direction: t ? "desc" : "asc"
		})));
	}, [T.sorts, w]);
	return /* @__PURE__ */ s(Yr, {
		...n,
		columns: P,
		data: j,
		page: A,
		total: i ? p.length : _,
		serverSorting: h ? T.sorts.map((e) => ({
			id: e.fieldId,
			desc: e.direction === "desc"
		})) : void 0,
		onServerSortingChange: h ? R : void 0,
		emptyText: T.filters.length ? a("aiTable.dataView.noFilteredRecords") : n.emptyText,
		rowStyle: (e) => qe(y.get(l.rowKey(e))),
		cellStyle: (e, t) => {
			let n = l.rowKey(e);
			return {
				...qe(x.get(n)?.get(t) ?? S.get(t)),
				...t === re ? Je(b.get(n)) : void 0
			};
		},
		columnStyle: (e) => qe(S.get(e)),
		groups: M.length ? M : void 0,
		onGroupToggle: L,
		frozenLeftColumnIds: ne,
		onFrozenColumnCountChange: (e) => C({ frozenColumnCount: Math.max(1, e) }),
		minFrozenColumnCount: 1,
		columnSettings: n.columnSettings,
		onColumnSettingsStateChange: n.columnSettings ? I : void 0,
		viewToolbar: ({ openColumnSettings: e, selectedCount: t }) => /* @__PURE__ */ s(cr, {
			openColumnSettings: e,
			selectedCount: t
		}),
		viewStatus: /* @__PURE__ */ s(dr, {}),
		showColumnControls: !1,
		scopeNote: r ? /* @__PURE__ */ s("span", { children: a("aiTable.dataView.scopeNote", {
			filtered: p.length,
			total: _
		}) }) : void 0
	});
}
function Zr({ columns: e, tableProps: t, showScopeNote: n = !0, clientPagination: r = !1 }) {
	let { config: i, state: a, rows: o, totalCount: c } = Z();
	if (a.modeTransition === "switching-to-smart") return /* @__PURE__ */ s(on, {
		...i.switchingLoaderCopy,
		className: "smart-table-loader-embedded"
	});
	if (a.mode === "classic") {
		let n = Math.max(1, Math.ceil(c / t.pageSize)), i = r ? Math.min(Math.max(1, t.page), n) : t.page, a = r ? o.slice((i - 1) * t.pageSize, i * t.pageSize) : o;
		return /* @__PURE__ */ s(Yr, {
			...t,
			columns: e,
			data: a,
			page: i,
			total: c
		});
	}
	return /* @__PURE__ */ s(Xr, {
		columns: e,
		tableProps: t,
		showScopeNote: n,
		clientPagination: r
	});
}
function Qr({ config: e, rows: t, totalCount: n, columns: r, tableProps: i }) {
	return /* @__PURE__ */ s(Lt, {
		config: e,
		rows: t,
		totalCount: n,
		children: /* @__PURE__ */ s(Zr, {
			columns: r,
			tableProps: i
		})
	});
}
function $r(e) {
	return String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""));
}
function ei(e, t, n) {
	return e.flatMap((e) => {
		let r = e.rows.filter((e) => t.has(n(e))), i = e.children ? ei(e.children, t, n) : void 0, a = i?.length ? i.reduce((e, t) => e + t.count, 0) : r.length;
		return a === 0 ? [] : [{
			...e,
			rows: r,
			children: i,
			count: a
		}];
	});
}
function ti(e, t) {
	return {
		id: e.fieldId,
		header: () => /* @__PURE__ */ c("span", {
			className: "flex items-center gap-1.5 whitespace-nowrap",
			children: [e.source === "ai" ? /* @__PURE__ */ s(z, { className: "size-3.5 text-primary" }) : null, e.label.replace("（Demo派生）", "")]
		}),
		size: e.type === "number" ? 120 : 150,
		cell: ({ row: n }) => {
			let r = e.getValue(n.original);
			if (r == null || r === "") return /* @__PURE__ */ s("span", {
				className: "text-muted-foreground",
				children: "—"
			});
			if (e.fieldId.toLowerCase().includes("progress") && typeof r == "number") return /* @__PURE__ */ c("div", {
				className: "flex min-w-24 items-center gap-2",
				children: [/* @__PURE__ */ c("span", {
					className: "w-8 text-right text-xs tabular-nums",
					children: [r, "%"]
				}), /* @__PURE__ */ s(pr, {
					value: r,
					className: "h-1.5 flex-1"
				})]
			});
			if (e.source === "ai" || e.type === "tag") return /* @__PURE__ */ s(ni, { value: String(r) });
			let i = e.formatValue?.(r, n.original) ?? String(r);
			return /* @__PURE__ */ s("span", {
				className: "text-sm",
				title: `${t(n.original)} · ${i}`,
				children: i
			});
		}
	};
}
function ni({ value: e }) {
	let { t } = J(), n = e.toUpperCase();
	return /* @__PURE__ */ s(zn, {
		variant: n.includes("HIGH") || e.includes(t("aiTable.badge.highRisk")) ? "rejected" : n.includes("MEDIUM") || n.includes("ATTENTION") || e.includes(t("aiTable.badge.attention")) || e.includes(t("aiTable.badge.mediumRisk")) ? "pending" : "approved",
		children: n === "HIGH" ? t("aiTable.badge.highRisk") : n === "MEDIUM" ? t("aiTable.badge.mediumRisk") : n === "LOW" ? t("aiTable.badge.lowRisk") : n === "ATTENTION" ? t("aiTable.badge.attention") : n === "NORMAL" ? t("aiTable.badge.normal") : e
	});
}
//#endregion
//#region src/components/ai-table/AIWmsDataTable.tsx
var ri = /* @__PURE__ */ new Set(["__select__", "actions"]), ii = /^\d{4}-\d{2}-\d{2}/;
function ai(e) {
	return String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""));
}
function oi(e) {
	return typeof e == "number" && e > 1e9 ? "datetime" : typeof e == "number" ? "number" : typeof e == "string" && ii.test(e) ? "datetime" : "text";
}
function si(e, t) {
	for (let n of e) {
		let e = t(n);
		if (e != null && e !== "") return e;
	}
}
function ci(e, t, n, r) {
	let i = new Map((n ?? []).map((e) => [e.fieldId, e])), a = [];
	for (let n of e) {
		let e = ai(n);
		if (!e || ri.has(e) || n.meta?.sticky === "right") continue;
		let r = i.get(e), o = r?.getValue ?? ((t) => t[e]), s = r?.type;
		if (!s) if (r?.options) s = "tag";
		else {
			let e = si(t, o);
			s = e === void 0 ? "text" : oi(e);
		}
		if (s === "datetime" && !r?.getValue) {
			let e = o;
			o = (t) => {
				let n = e(t);
				if (!(n == null || n === "")) return typeof n == "number" ? new Date(n).toISOString().replace("T", " ").slice(0, 19) : n;
			};
		}
		a.push({
			fieldId: e,
			label: r?.label ?? (typeof n.header == "string" ? n.header : e),
			type: s,
			source: "business",
			getValue: o,
			formatValue: r?.formatValue,
			options: r?.options,
			filterable: r?.filterable ?? !0,
			groupable: r?.groupable ?? !0,
			colorable: r?.colorable ?? !0,
			sortable: r?.sortable ?? !0,
			aiReadable: r?.aiReadable ?? !0
		});
	}
	for (let e of r ?? []) a.some((t) => t.fieldId === e.fieldId) || a.push(e);
	return a;
}
function li(e) {
	if (!(e.enabled ?? !0)) {
		let { aiTable: t, enabled: n, ...r } = e;
		return /* @__PURE__ */ s(Yr, { ...r });
	}
	return /* @__PURE__ */ s(ui, { ...e });
}
function ui(t) {
	let { aiTable: n, columns: r, data: i, total: a, getRowId: o, enabled: c, ...l } = t, { tableId: u, rowKey: d, fieldOverrides: f, extraFields: p, dynamicColumnAnchorFieldId: m, switchingLoaderCopy: h, aiAdapter: g } = n, _ = e.useCallback((e) => String(i.indexOf(e)), [i]), v = d ?? o ?? _;
	return /* @__PURE__ */ s(Lt, {
		config: e.useMemo(() => ({
			tableId: u,
			rowKey: v,
			fields: ci(r, i, f, p),
			aiAdapter: g,
			demoScope: "CURRENT_PAGE",
			dynamicColumnAnchorFieldId: m,
			switchingLoaderCopy: h
		}), [
			g,
			r,
			i,
			m,
			p,
			f,
			v,
			h,
			u
		]),
		rows: i,
		totalCount: a,
		children: /* @__PURE__ */ s(Zr, {
			columns: r,
			tableProps: {
				...l,
				getRowId: o
			}
		})
	});
}
//#endregion
//#region src/declarative.tsx
function di(e) {
	if (!e.id.trim()) throw Error("A table id is required");
	let t = e.fields.map((e) => e.id);
	if (!t.length || new Set(t).size !== t.length) throw Error("Field ids must be nonempty and unique");
	for (let t of e.fields) {
		if (!t.id || [
			"actions",
			"__select__",
			"__index__"
		].includes(t.id)) throw Error(`Reserved or empty field id: ${t.id}`);
		if (!t.read && !t.accessor) throw Error(`Declare accessor or read for ${t.id}`);
	}
	return e;
}
function fi(e) {
	let t = e.fields.map((e) => ({
		fieldId: e.id,
		label: e.label,
		type: e.type,
		source: e.source ?? "business",
		getValue: e.read ?? ((t) => t[e.accessor]),
		formatValue: e.format,
		options: e.options,
		filterable: e.filterable ?? !0,
		groupable: e.groupable ?? !0,
		sortable: e.sortable ?? !0,
		colorable: e.colorable ?? !0,
		aiReadable: e.aiReadable ?? !0
	}));
	return {
		fields: t,
		columns: e.fields.map((e) => {
			let n = t.find((t) => t.fieldId === e.id);
			return {
				id: e.id,
				accessorFn: n.getValue,
				header: e.label,
				size: e.width ?? 160,
				enableSorting: e.sortable ?? !0,
				cell: ({ row: t }) => {
					let r = n.getValue(t.original);
					return e.render ? e.render(r, t.original) : e.format ? e.format(r, t.original) : r == null || r === "" ? "—" : String(r);
				}
			};
		})
	};
}
function pi({ definition: t, rows: n, storageScope: r, defaultMode: i = "classic", modeLock: a, enabled: o = !0, showModeSwitch: l = !0, showScopeNote: u = !0, className: d, leadingColumns: f, additionalColumns: p, page: m, pageSize: h, onPageChange: g, onPageSizeChange: _, onQueryChange: v, queryFieldIds: y, ...b }) {
	let x = m !== void 0 && g !== void 0, [S, C] = e.useState(m ?? 1), [w, T] = e.useState(h ?? 10), E = x ? m : S, D = x ? h ?? 10 : w, O = x ? g : C, k = x ? _ : (e) => {
		T(e), C(1);
	}, A = e.useMemo(() => fi(t), [t]), j = e.useMemo(() => [
		...f ?? [],
		...A.columns,
		...p ?? []
	], [
		p,
		A,
		f
	]), M = e.useMemo(() => t.ai.adapter, [t.ai]);
	if (!r.trim()) throw Error("storageScope is required");
	let N = n.map(t.rowKey);
	if (N.some((e) => !e) || new Set(N).size !== N.length) throw Error("Rows must have unique, nonempty business keys");
	let P = JSON.stringify([r, t.id]), F = {
		tableId: P,
		rowKey: t.rowKey,
		fields: A.fields,
		aiAdapter: M,
		demoScope: "CURRENT_PAGE",
		dynamicColumnAnchorFieldId: t.dynamicColumnAnchorFieldId,
		switchingLoaderCopy: t.switchingLoaderCopy
	}, ee = x ? n : n.slice((E - 1) * D, E * D), te = {
		...b,
		page: E,
		pageSize: D,
		onPageChange: O,
		onPageSizeChange: k,
		total: x ? b.total : n.length
	};
	return /* @__PURE__ */ s("div", {
		className: Q("ai-table-plugin", d),
		"data-ai-table-id": t.id,
		children: o ? /* @__PURE__ */ c(Lt, {
			config: F,
			rows: n,
			totalCount: b.total,
			defaultMode: i,
			modeLock: a,
			onQueryChange: v,
			queryFieldIds: y,
			children: [l ? /* @__PURE__ */ s("div", {
				className: "mb-3 flex justify-end",
				children: /* @__PURE__ */ s($t, {})
			}) : null, /* @__PURE__ */ s(Zr, {
				columns: j,
				tableProps: {
					...te,
					getRowId: t.rowKey
				},
				showScopeNote: u,
				clientPagination: !x
			})]
		}, P) : /* @__PURE__ */ s(li, {
			...te,
			enabled: !1,
			columns: j,
			data: ee,
			getRowId: t.rowKey,
			aiTable: {
				tableId: P,
				aiAdapter: M
			}
		})
	});
}
//#endregion
//#region src/adapters/http.ts
function mi(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Invalid AI response object");
	return e;
}
function hi(e) {
	if (!Array.isArray(e)) throw Error("AI response must be an array");
	return e;
}
function gi(e) {
	return e.map(({ fieldId: e, label: t, type: n, options: r }) => ({
		fieldId: e,
		label: t,
		type: n,
		options: r
	}));
}
function _i(e, t, n) {
	let r = mi(e), i = t.find((e) => e.fieldId === r.fieldId && e[n] && e.aiReadable);
	if (!i) throw Error(`Unknown or unavailable AI field: ${String(r.fieldId)}`);
	if (!Be(i.type).some((e) => e.value === r.operator)) throw Error("Invalid AI rule operator");
	if (typeof r.id != "string" || !r.id) throw Error("AI rule id is required");
	return r;
}
function vi({ request: e }) {
	return {
		async generateFilters({ instruction: t, fields: n }) {
			let r = n.filter((e) => e.aiReadable && e.filterable);
			return hi(await e("filters", {
				instruction: t,
				fields: gi(r)
			})).map((e) => {
				let t = _i(e, r, "filterable");
				if (t.conjunction !== "and" && t.conjunction !== "or") throw Error("Invalid AI conjunction");
				return {
					id: t.id,
					fieldId: t.fieldId,
					operator: t.operator,
					value: t.value,
					conjunction: t.conjunction
				};
			});
		},
		async generateColorRules({ instruction: t, fields: n }) {
			let r = n.filter((e) => e.aiReadable && e.colorable);
			return hi(await e("colors", {
				instruction: t,
				fields: gi(r)
			})).map((e) => {
				let t = _i(e, r, "colorable");
				if (![
					"cell",
					"row",
					"rowMarker",
					"column"
				].includes(String(t.scope))) throw Error("Invalid AI color scope");
				if (!Ue.some((e) => e.value === t.colorToken) && ![
					"red",
					"lightRed",
					"green",
					"lightGreen",
					"yellow",
					"blue",
					"lightBlue"
				].includes(String(t.colorToken))) throw Error("Invalid AI color token");
				return {
					id: t.id,
					fieldId: t.fieldId,
					operator: t.operator,
					value: t.value,
					scope: t.scope,
					colorToken: t.colorToken
				};
			});
		},
		async previewAIField({ definition: t, rows: n, rowKey: r, fields: i }) {
			let a = t.referencedFieldIds.map((e) => {
				let t = i.find((t) => t.fieldId === e && t.aiReadable);
				if (!t) throw Error(`AI reference must be readable: ${e}`);
				return t;
			}), o = new Set(n.map(r)), s = await e("field-preview", {
				definition: t,
				fields: gi(a),
				rows: n.map((e) => ({
					rowKey: r(e),
					values: Object.fromEntries(a.map((t) => [t.fieldId, t.getValue(e)]))
				}))
			}), c = /* @__PURE__ */ new Set();
			return hi(s).map((e) => {
				let n = mi(e);
				if (typeof n.rowKey != "string" || !o.has(n.rowKey) || c.has(n.rowKey)) throw Error("Unknown or duplicate AI result row");
				if (c.add(n.rowKey), n.error !== void 0 && typeof n.error != "string") throw Error("Invalid AI result error");
				if (!n.error && n.value !== void 0 && n.value !== null && (t.outputType === "number" ? typeof n.value != "number" || !Number.isFinite(n.value) : typeof n.value != "string")) throw Error("AI field result has the wrong output type");
				return {
					rowKey: n.rowKey,
					value: n.value,
					error: n.error
				};
			});
		}
	};
}
//#endregion
export { Ln as AIColorPanel, pi as AIDataTable, Xn as AIFieldPanel, nr as AIFilterPanel, ir as AIGroupingPanel, or as AISortingPanel, cn as AITableClassicOnly, tr as AITableConditionBuilder, Zr as AITableContent, Qr as AITableDataView, dr as AITableDraftBar, fr as AITableFreezeBoundary, sn as AITableGlobalModeSwitch, $t as AITableModeSwitch, ln as AITablePageHeader, Lt as AITableProvider, Ot as AITableShellProvider, cr as AITableToolbar, li as AIWmsDataTable, Yr as BaseDataTable, Ue as COLOR_OPTIONS, He as COLOR_PALETTE_ROWS, on as SmartTableSwitchingLoader, $e as UNGROUPED_LABEL, Ze as applyFilters, et as applyGrouping, Qe as applySorting, Tt as clearAIFieldValues, fi as compileAITable, ze as createDefaultViewConfig, vi as createHttpAIAdapter, ot as createRowProjection, di as defineAITable, tt as flattenGroups, X as generateId, Ke as getColorOption, qe as getColorStyle, mt as getColorSummary, Ye as getFieldById, ct as getFilterSummary, lt as getGroupSummary, Be as getOperatorsByFieldType, Je as getRowMarkerStyle, ut as getSortSummary, at as isDirty, Ct as loadAIValues, yt as loadMode, xt as loadView, it as normalizeFrozenColumnCount, st as normalizeViewConfig, nt as resolveColorRules, rt as resolveColumnColorRules, wt as saveAIValues, bt as saveMode, St as saveView, Et as setAIFieldValue, Z as useAITable, Kr as withSelectionColumn };

//# sourceMappingURL=ai-table.js.map