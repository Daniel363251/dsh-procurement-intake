import { createInstance as e } from "i18next";
import { useTranslation as t } from "react-i18next";
import * as n from "react";
import { useCallback as r, useEffect as i, useMemo as a, useRef as o, useState as s } from "react";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
import { ArrowDown as d, ArrowUp as f, ArrowUpDown as p, Bot as m, Calendar as h, Check as g, CheckCircle2 as _, CheckIcon as v, ChevronDown as y, ChevronDownIcon as b, ChevronLeftIcon as x, ChevronRightIcon as S, ChevronUpIcon as C, ChevronsLeft as w, ChevronsLeftIcon as T, ChevronsRight as E, ChevronsRightIcon as D, Clock as O, Columns3Icon as k, Copy as A, Filter as j, GripVertical as M, Hash as N, HelpCircle as P, LayoutList as F, List as ee, Loader2 as I, LoaderCircle as te, Palette as ne, Pin as L, Plus as R, RefreshCw as re, RotateCcw as z, Settings2 as ie, Sparkles as B, Table2 as ae, Tag as oe, ThumbsDown as V, ThumbsUp as se, Trash2 as ce, Type as le, UserRound as ue, X as de, XIcon as fe } from "lucide-react";
import { cva as H } from "class-variance-authority";
import { AlertDialog as U, Checkbox as pe, Dialog as me, DropdownMenu as he, Label as ge, Popover as _e, Progress as ve, Select as W, Slot as ye, Tabs as be, Tooltip as xe } from "radix-ui";
import { clsx as G } from "clsx";
import { twMerge as Se } from "tailwind-merge";
import { flexRender as Ce, getCoreRowModel as we, getFilteredRowModel as Te, getSortedRowModel as Ee, useReactTable as De } from "@tanstack/react-table";
import { DndContext as K, DragOverlay as Oe, PointerSensor as ke, closestCenter as Ae, useSensor as je, useSensors as Me } from "@dnd-kit/core";
import { SortableContext as Ne, arrayMove as q, useSortable as Pe, verticalListSortingStrategy as Fe } from "@dnd-kit/sortable";
import { CSS as Ie } from "@dnd-kit/utilities";
var Le = {
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
}, Re = {
	aiTable: {
		toolbar: {
			filter: "Filter",
			group: "Group",
			sort: "Sort",
			color: "Color",
			addField: "Add Field",
			savedView: "Saved View",
			groupSummaryByField: "Grouped by {{field}}"
		},
		draftBar: {
			filter: "Filter",
			group: "Group",
			sort: "Sort",
			color: "Color",
			aiField: "AI Field",
			view: "View",
			viewSaved: "View saved",
			adjustedConfig: "You adjusted the {{label}} configuration",
			cancel: "Cancel",
			save: "Save"
		},
		filter: {
			title: "Filter",
			placeholder: "Tell AI what you want to see. e.g., orders shipping today with stock shortages",
			generated: "Filters generated for \"{{instruction}}\"",
			noConditions: "No applicable conditions found. Try a more specific description.",
			generateFailed: "Generation failed. Please retry.",
			generating: "Generating filters for \"{{instruction}}\"",
			feedbackHelpful: "Helpful",
			feedbackUnhelpful: "Not helpful",
			copyInstruction: "Copy generation note",
			conditionDescription: "Show records matching the following conditions in the current view",
			when: "When",
			and: "And",
			or: "Or",
			addCondition: "Add condition",
			addConditionGroup: "Add filter group",
			deleteCondition: "Delete filter condition {{index}}"
		},
		group: {
			title: "Group by field",
			collapseAll: "Collapse all",
			expandAll: "Expand all",
			optionOrder: "Order",
			optionReverse: "Reverse",
			addGroup: "Add group",
			emptyHint: "Select a field to organize current page records into collapsible groups",
			apply: "Apply",
			deleteGroup: "Delete group {{index}}"
		},
		sort: {
			title: "Sort by conditions",
			addSort: "Add sort condition",
			emptyHint: "Add fields to sort current page records by priority",
			apply: "Apply",
			dragHint: "Drag to adjust priority of sort condition {{index}}",
			asc: "Sort condition {{index}} ascending",
			desc: "Sort condition {{index}} descending",
			deleteSort: "Delete sort condition {{index}}"
		},
		color: {
			title: "Color",
			placeholder: "Describe what to color. e.g., cells with shortage > 3 in red",
			generated: "Generated {{count}} color rules",
			noRules: "No applicable color rules found",
			generateFailed: "Generation failed. Please retry.",
			generating: "Generating color rules…",
			ruleDescription: "Apply colors by the following rules",
			smartColor: "Smart coloring",
			columnHint: "Entire column stays highlighted, no condition needed",
			addRule: "Add color condition",
			apply: "Apply",
			dragHint: "Drag to adjust priority of color condition {{index}}",
			deleteRule: "Delete color condition {{index}}",
			backgroundFill: "Background fill",
			selectColor: "Select fill color, current: {{label}}",
			selectScope: "Select fill scope, current: {{label}}",
			scopeMenu: "Color scope"
		},
		aiField: {
			title: "AI Field",
			close: "Close AI Field",
			createdFields: "Created AI fields",
			fieldName: "Field name",
			fieldNamePlaceholder: "e.g., Fulfillment risk level",
			outputType: "Output type",
			prompt: "Prompt",
			promptPlaceholder: "Based on the following fields, evaluate each record and return only the needed results.",
			insertField: "Insert field",
			sourceDerived: "Derived",
			sourceAi: "AI",
			sourceBusiness: "Business",
			generationSettings: "Generation settings",
			autoUpdate: "Auto update",
			autoUpdateTooltip: "When referenced field values change, AI field will auto-regenerate",
			allowEmptyReferences: "Allow empty referenced values",
			allowEmptyReferencesTooltip: "When referenced field values are empty, AI generation is not affected",
			preview: "Preview first 5 rows",
			repreview: "Re-preview",
			record: "Record",
			previewColumn: "{{name}} (Preview)",
			noRecords: "No records available for preview on current page",
			cancel: "Cancel",
			runPreview: "Run first 5 rows",
			save: "Save",
			generating: "Generating…",
			generateFailed: "Generation failed",
			skipped: "Skipped: empty referenced field value",
			waiting: "Waiting",
			rerun: "Re-run {{name}}",
			delete: "Delete {{name}}",
			outputText: "Text",
			outputNumber: "Number",
			outputTag: "Tag",
			promptAriaLabel: "AI field prompt",
			tokenAriaLabel: "Field: {{label}}",
			tooltipSuffix: " info"
		},
		modeSwitch: {
			switchingToSmart: "Switching to smart table",
			backToClassic: "Back to classic table",
			switchToSmart: "Switch to smart table",
			switching: "Switching",
			aiTable: "AI Table",
			discardTitle: "Discard unsaved configuration?",
			discardDescription: "The current smart table has unsaved configuration. Switching will discard your changes.",
			cancel: "Cancel",
			discardAndSwitch: "Discard and switch"
		},
		freeze: {
			frozenColumns: "Frozen columns (left)",
			columnUnit: "cols",
			clearFreeze: "Clear freeze",
			hint: "Click + to freeze left columns, keeping them visible during horizontal scroll"
		},
		loader: {
			title: "Switching to AI Smart Table",
			subtitle: "Identifying field semantics and preparing natural language filtering, smart grouping, and view generation.",
			statusText: "Preparing smart table",
			askText: "Ask this table: Find inbound orders with arrival delays that are still incomplete",
			smartView: "Smart views",
			allDocuments: "All documents",
			exceptionView: "Exception view",
			groupBySupplier: "Group by supplier",
			arrivalTimeout: "Arrival timeout",
			quantityDiff: "Quantity diff",
			creatingGroup: "Creating groups: Supplier / Status / Arrival risk",
			generatingView: "Generating views: Arrival timeout / Quantity diff / Exception follow-up",
			capabilityUnderstanding: "Field understanding",
			capabilityFiltering: "Natural language filtering",
			capabilityGrouping: "Smart grouping",
			capabilityView: "View generation"
		},
		panelParts: {
			generating: "Generating…",
			generate: "Generate",
			cancel: "Cancel",
			save: "Save"
		},
		valueEditor: {
			selectPlaceholder: "Select",
			rangeTo: "to",
			inputPlaceholder: "Enter value",
			rangeStart: "Range start value",
			rangeEnd: "Range end value"
		},
		engine: {
			filterSummary: "Filtered by {{count}} field(s)",
			groupSummary: "Grouped by {{count}} field(s)",
			sortSummary: "Sorted by {{count}} field(s)",
			sortSummaryByField: "Sort by {{field}}",
			sortDefault: "Sort 1",
			colorSummary: "Color {{count}}",
			ungroupedLabel: "Unfilled"
		},
		operators: {
			equals: "Equals",
			notEquals: "Not equals",
			contains: "Contains",
			notContains: "Does not contain",
			isEmpty: "Is empty",
			notEmpty: "Is not empty",
			greaterThan: "Greater than",
			lessThan: "Less than",
			greaterThanOrEqual: "Greater than or equal",
			lessThanOrEqual: "Less than or equal",
			between: "Between",
			earlierThan: "Earlier than",
			laterThan: "Later than",
			isToday: "Today",
			isPast: "Overdue",
			isFuture: "Future",
			withinPastDays: "Past N days",
			withinNextDays: "Next N days"
		},
		colorPalette: {
			coral: "Coral",
			orange: "Orange",
			yellow: "Yellow",
			lime: "Lime",
			green: "Green",
			teal: "Teal",
			cyan: "Cyan",
			blue: "Blue",
			purple: "Purple",
			pink: "Pink",
			gray: "Gray"
		},
		colorScope: {
			cell: "Cell",
			cellTitle: "Highlight key data by condition",
			cellDesc: "Automatically color cells that match rules to spot anomalies, targets, and priority records at a glance.",
			row: "Entire row",
			rowTitle: "Highlight entire row by condition",
			rowDesc: "Color entire rows that match rules to make related fields visible and strengthen record integrity.",
			rowMarker: "Row marker",
			rowMarkerTitle: "Row marker color",
			rowMarkerDesc: "Show color markers on the left of row numbers to quickly identify key rows without blocking data.",
			column: "Entire column",
			columnTitle: "Column color",
			columnDesc: "Highlight an entire column for emphasis.",
			previewTask: "Task",
			previewPriority: "Priority",
			previewStatus: "Status"
		},
		dataView: {
			noFilteredRecords: "No records match the smart filter on current page",
			scopeNote: "Current page demo · {{filtered}} loaded / {{total}} total"
		},
		badge: {
			highRisk: "High risk",
			mediumRisk: "Medium risk",
			lowRisk: "Low risk",
			attention: "Attention",
			normal: "Normal"
		},
		mock: {
			generateFailed: "Generation failed",
			publishRemark: "AI generated and published"
		}
	},
	wms: {
		group: { selectRows: "Select {{count}} rows in group {{label}}" },
		rowActions: { srLabel: "Action" },
		summary: {
			total: "Total",
			placeholder: "Click settings to select summary fields",
			settings: "Settings",
			selectAll: "All",
			restoreDefault: "Restore Default"
		},
		timeline: {
			completed: "Completed",
			details: "View Details"
		},
		columnSettings: {
			density: {
				compact: "Compact",
				medium: "ingium",
				relaxed: "Relaxed"
			},
			pinned: "Pinned",
			groupOther: "Other",
			title: "Column Settings",
			rowHeight: "Row Height",
			unselectAll: "Unselect All",
			selectAll: "Select All",
			required: "Required",
			selected: "Selected",
			dragHint: "Drag to adjust column order",
			restoreDefault: "Restore Default",
			cancel: "Cancel",
			save: "Save"
		},
		column: "Column",
		freeze: {
			dragLabel: "Drag to adjust frozen columns",
			tooltip: "Drag to adjust freeze area"
		},
		pagination: {
			selectedRows: "Selected {{selected}} rows, {{total}} total",
			totalRecords: "{{total}} records",
			rowsPerPage: "Rows per page",
			pageInfo: "Page {{page}} / {{total}}"
		},
		selectedCount: "{{count}} selected",
		changeAudit: {
			tableAria: "Configuration change audit",
			version: "Version",
			action: "Action",
			occurredAt: "Occurred At",
			actor: "Operator",
			reason: "Reason",
			summary: "Summary",
			fieldChanges: "Field changes",
			field: "Field",
			before: "Before",
			after: "After",
			notSet: "Not set",
			removed: "Removed",
			noFieldDiff: "This change has no field-level differences.",
			empty: "No change records",
			expand: "Expand",
			collapse: "Collapse",
			toggleAria: "{{state}} field changes for {{version}}",
			fieldChangesAria: "Field changes: {{action}}"
		},
		activity: {
			records: "Activity record",
			occurredAt: "Occurred at",
			action: "Action",
			actor: "Actor"
		}
	},
	common: {
		action: {
			confirm: "Confirm",
			cancel: "Cancel",
			save: "Save",
			edit: "Edit",
			delete: "Delete",
			detail: "Detail",
			search: "Search",
			reset: "Reset",
			export: "Export",
			import: "Import",
			batchConfirm: "Batch Confirm",
			close: "Close",
			submit: "Submit",
			back: "Back",
			refresh: "Refresh",
			more: "More",
			expand: "Expand",
			collapse: "Collapse",
			logout: "Logout",
			resetDemo: "Reset Demo Data",
			confirmReset: "Confirm Reset",
			switchWarehouse: "Switch Warehouse",
			confirmSwitch: "Confirm Switch",
			switching: "Switching...",
			askAi: "Ask Nexus AI",
			processing: "Submit Med...",
			submitting: "Submitting…",
			create: "Create",
			disable: "Disable",
			enable: "Enabled",
			expandAll: "Expand All",
			collapseAll: "Collapse All",
			done: "Done",
			view: "View",
			viewDetail: "View Detail",
			saving: "Saving…",
			retry: "Retry",
			backToList: "Back to List",
			remove: "Remove",
			saveChanges: "Save Changes"
		},
		status: {
			enabled: "Enabled",
			disabled: "Disabled",
			success: "Success",
			failed: "Failed",
			pending: "Pending",
			processing: "Processing",
			completed: "Completed",
			cancelled: "Cancelled",
			deleting: "Deleting…",
			loading: "Loading…"
		},
		label: {
			total: "Total",
			items: "items",
			page: "Page",
			pageSize: "/ page",
			noData: "No Data",
			loading: "Loading...",
			all: "All",
			selectPlaceholder: "Please select",
			inputPlaceholder: "Please enter",
			searchPlaceholder: "Enter keywords to search",
			operation: "Action",
			remark: "Remark",
			creator: "Creator",
			createTime: "Created At",
			modifier: "Modifier",
			modifyTime: "Modified At",
			noWarehouse: "No warehouse selected",
			noWarehouseAvailable: "No warehouses available",
			aiFeatures: "AI Features",
			labScene: "Lab scene",
			sceneLab: "Scenario Workbench Lab",
			sceneLabDesc: "Select the business scenario to analyze and process",
			currentScene: "Current",
			switchable: "Switchable",
			moreFilters: "More Filters",
			firstPage: "First",
			prevPage: "Previous",
			nextPage: "Next",
			lastPage: "Last",
			status: "Status",
			aiAnalyzed: "AI Analyzed",
			none: "None",
			optional: "Optional",
			yes: "Yes",
			no: "No",
			completeTime: "Completed At",
			selectDateRange: "Select date range",
			unassigned: "Unassigned",
			selectedCount: "{{count}} items selected",
			operationFailed: "Operation Failed",
			submitting: "Submitting…",
			processing: "Processing…"
		},
		msg: {
			saveSuccess: "Saved successfully",
			deleteSuccess: "Deleted successfully",
			operateSuccess: "Operation succeeded",
			operateFailed: "Operation failed",
			confirmDelete: "Are you sure to delete the selected records?",
			confirmBatchDelete: "Are you sure to delete the selected {{count}} records?",
			noSelection: "Please select records first",
			required: "Required field cannot be empty",
			networkError: "Network error, please try again later",
			resetSuccess: "Demo data has been reset",
			resetConfirmDesc: "Are you sure to reset all demo data to its initial state? All current operation records and status changes will be cleared.",
			upgradeOms: "Order Management System is being upgraded, stay tuned",
			upgradeTms: "Transportation Management System is being upgraded, stay tuned",
			upgradeBilling: "Billing Management System is being upgraded, stay tuned",
			switchWarehouseFailed: "Failed to switch warehouse",
			confirmSwitchWarehouse: "Are you sure to switch to 「{{name}}」? The page will refresh after switching.",
			createSuccess: "Created successfully",
			createFailed: "Create failed",
			saveFailed: "Save failed",
			deleteFailed: "Delete failed",
			enableSuccess: "Enabled succeeded",
			disableSuccess: "Disabled successfully",
			batchEnableSuccess: "Batch enable succeeded",
			batchDisableSuccess: "Batch disable succeeded",
			irreversible: "This action cannot be undone.",
			loadFailed: "Load failed, please retry"
		},
		app: {
			title: "Warehouse",
			oms: "Order",
			tms: "Transportation",
			billing: "Billing"
		},
		user: { defaultName: "Admin" },
		conflict: {
			title: "Data has been modified by another user",
			description: "This order has been modified by another user. Please refresh and try again."
		},
		placeholder: {
			input: "Please enter",
			dateRange: "Select date range",
			remarkOptional: "Optional, max 200 chars",
			remarkMax: "Max 200 characters",
			selectDate: "Select date",
			selectDateRange: "Select date range"
		},
		searching: "Searching...",
		column: { action: "Action" },
		unit: { pieces: "pcs" },
		all: "All",
		selectedCount: "{{count}} items selected",
		tooltip: { inDevelopment: "Feature under development" },
		switch: {
			on: "Enabled",
			off: "Closed"
		},
		tab: {
			active: "Enabled",
			empty: "Empty",
			inactive: "Disabled",
			occupied: "Occupied"
		},
		desc: { remarkOptional: "Optional, max 200 characters." },
		toast: {
			copied: "Copied to clipboard",
			operationFailed: "Operation failed"
		},
		field: {
			skuCode: "SKU Code",
			skuName: "SKU Name",
			batchNo: "Batch No."
		},
		ai: { analyzed: "AI Analyzed" },
		dirtyGuard: {
			title: "Discard changes?",
			description: "You have unsaved changes. Discarding will lose your modifications.",
			continueEditing: "Continue editing",
			confirmDiscard: "Discard"
		},
		aria: { clearDate: "Clear date" },
		loading: "Loading…",
		formReview: { title: "Review the following information" },
		password: { help: "8-20 characters, must include uppercase, lowercase, digit and special character" }
	}
}, ze = {
	aiTable: {},
	wms: { activity: {
		records: "ประวัติการดำเนินการ",
		occurredAt: "เวลาที่เกิดขึ้น",
		action: "การดำเนินการ",
		actor: "ผู้ดำเนินการ"
	} },
	common: {
		action: {
			retry: "ลองอีกครั้ง",
			expandAll: "ไขทั้งหมด",
			collapseAll: "ย่อทั้งหมด",
			edit: "แก้ไข",
			delete: "ลบ"
		},
		label: { noData: "ไม่มีข้อมูล" },
		formReview: { title: "ตรวจสอบข้อมูลต่อไปนี้" }
	}
}, J = e();
J.init({
	lng: "zh-CN",
	fallbackLng: "zh-CN",
	initAsync: !1,
	resources: {
		"zh-CN": { translation: Le },
		"en-US": { translation: Re },
		"th-TH": { translation: ze }
	},
	interpolation: { escapeValue: !1 }
});
function Y() {
	return t(void 0, { i18n: J });
}
async function Be(e) {
	await J.changeLanguage(e);
}
//#endregion
//#region src/components/ai-table/types.ts
function Ve() {
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
function He(e) {
	switch (e) {
		case "text": return [
			{
				value: "equals",
				label: J.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: J.t("aiTable.operators.notEquals")
			},
			{
				value: "contains",
				label: J.t("aiTable.operators.contains")
			},
			{
				value: "notContains",
				label: J.t("aiTable.operators.notContains")
			},
			{
				value: "isEmpty",
				label: J.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: J.t("aiTable.operators.notEmpty")
			}
		];
		case "number": return [
			{
				value: "equals",
				label: J.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: J.t("aiTable.operators.notEquals")
			},
			{
				value: "greaterThan",
				label: J.t("aiTable.operators.greaterThan")
			},
			{
				value: "lessThan",
				label: J.t("aiTable.operators.lessThan")
			},
			{
				value: "greaterThanOrEqual",
				label: J.t("aiTable.operators.greaterThanOrEqual")
			},
			{
				value: "lessThanOrEqual",
				label: J.t("aiTable.operators.lessThanOrEqual")
			},
			{
				value: "between",
				label: J.t("aiTable.operators.between")
			},
			{
				value: "isEmpty",
				label: J.t("aiTable.operators.isEmpty")
			}
		];
		case "tag": return [
			{
				value: "equals",
				label: J.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: J.t("aiTable.operators.notEquals")
			},
			{
				value: "isEmpty",
				label: J.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: J.t("aiTable.operators.notEmpty")
			}
		];
		case "date":
		case "datetime": return [
			{
				value: "equals",
				label: J.t("aiTable.operators.equals")
			},
			{
				value: "notEquals",
				label: J.t("aiTable.operators.notEquals")
			},
			{
				value: "greaterThan",
				label: J.t("aiTable.operators.earlierThan")
			},
			{
				value: "lessThan",
				label: J.t("aiTable.operators.laterThan")
			},
			{
				value: "between",
				label: J.t("aiTable.operators.between")
			},
			{
				value: "isToday",
				label: J.t("aiTable.operators.isToday")
			},
			{
				value: "isPast",
				label: J.t("aiTable.operators.isPast")
			},
			{
				value: "isFuture",
				label: J.t("aiTable.operators.isFuture")
			},
			{
				value: "withinPastDays",
				label: J.t("aiTable.operators.withinPastDays")
			},
			{
				value: "withinNextDays",
				label: J.t("aiTable.operators.withinNextDays")
			},
			{
				value: "isEmpty",
				label: J.t("aiTable.operators.isEmpty")
			},
			{
				value: "notEmpty",
				label: J.t("aiTable.operators.notEmpty")
			}
		];
		default: return [{
			value: "equals",
			label: J.t("aiTable.operators.equals")
		}];
	}
}
//#endregion
//#region src/components/ai-table/color-palette.ts
var Ue = [
	{
		family: "coral",
		label: J.t("aiTable.colorPalette.coral"),
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
		label: J.t("aiTable.colorPalette.orange"),
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
		label: J.t("aiTable.colorPalette.yellow"),
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
		label: J.t("aiTable.colorPalette.lime"),
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
		label: J.t("aiTable.colorPalette.green"),
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
		label: J.t("aiTable.colorPalette.teal"),
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
		label: J.t("aiTable.colorPalette.cyan"),
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
		label: J.t("aiTable.colorPalette.blue"),
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
		label: J.t("aiTable.colorPalette.purple"),
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
		label: J.t("aiTable.colorPalette.pink"),
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
		label: J.t("aiTable.colorPalette.gray"),
		colors: [
			"#f5f5f5",
			"#e7e7e7",
			"#d2d2d2",
			"#b7b7b7",
			"#8e8e8e"
		]
	}
], We = [
	1,
	2,
	3,
	4,
	5
].map((e) => Ue.map((t) => ({
	value: `${t.family}${e}`,
	label: `${t.label} ${e}`,
	backgroundColor: t.colors[e - 1],
	foregroundColor: e === 5 && !t.darkTextOnLastShade ? "#ffffff" : "#20242d"
}))), Ge = We.flat(), Ke = new Map(Ge.map((e) => [e.value, e])), qe = {
	red: "coral4",
	lightRed: "coral2",
	green: "green4",
	lightGreen: "green2",
	yellow: "yellow3",
	blue: "blue4",
	lightBlue: "blue2"
};
function Je(e) {
	let t = qe[e] ?? e;
	return Ke.get(t) ?? Ke.get("coral4");
}
function Ye(e) {
	if (!e) return;
	let t = Je(e);
	return {
		backgroundColor: t.backgroundColor,
		color: t.foregroundColor
	};
}
function Xe(e) {
	if (e) return { boxShadow: `inset 3px 0 0 ${Je(e).backgroundColor}` };
}
//#endregion
//#region src/components/ai-table/ai-table-engine.ts
function Ze(e, t) {
	return e.find((e) => e.fieldId === t);
}
function Qe(e, t, n, r) {
	let i = (r === "date" || r === "datetime") && n === "today" ? mt(/* @__PURE__ */ new Date()) : n, a = (r === "date" || r === "datetime") && typeof e == "string" ? e.slice(0, 10) : e;
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
			let e = mt(/* @__PURE__ */ new Date());
			return String(a ?? "").slice(0, 10) === e;
		}
		case "isPast": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = mt(/* @__PURE__ */ new Date());
			return String(a ?? "").slice(0, 10) < e;
		}
		case "isFuture": {
			if (r !== "date" && r !== "datetime") return !1;
			let e = mt(/* @__PURE__ */ new Date());
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
function $e(e, t, n) {
	if (!t.length) return e;
	let r = [], i = [];
	for (let e of t) e.conjunction === "or" && i.length > 0 ? (r.push(i), i = [e]) : i.push(e);
	return i.length > 0 && r.push(i), e.filter((e) => r.some((t) => t.every((t) => {
		let r = Ze(n, t.fieldId);
		return !r || Qe(r.getValue(e), t.operator, t.value, r.type);
	})));
}
function et(e, t, n) {
	if (!t.length) return e;
	let r = t.flatMap((e) => {
		let t = Ze(n, e.fieldId);
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
			let c = ht(r, a, i, e.row, t.row);
			if (c !== 0) return n.direction === "desc" ? -c : c;
		}
		return e.index - t.index;
	}).map(({ row: e }) => e) : e;
}
var tt = J.t("aiTable.engine.ungroupedLabel");
function nt(e, t, n, r) {
	if (!t.length) return [];
	let i = Math.min(t.length, 2);
	function a(e, o, s) {
		if (o >= i) return [];
		let c = t[o], l = Ze(n, c.fieldId);
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
			let t = u.get(e), n = t[0], d = e === "__ungrouped__" ? tt : l.formatValue?.(l.getValue(n), n) ?? e, f = `${s}${s ? ":" : ""}${c.fieldId}=${e}`, p = r.includes(f), m = {
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
function rt(e) {
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
function it(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a;
	for (let o of t) {
		let t = Ze(n, o.fieldId);
		t && Qe(t.getValue(e), o.operator, o.value, t.type) && (o.scope === "cell" ? r.has(o.fieldId) || r.set(o.fieldId, o.colorToken) : o.scope === "row" ? i ||= o.colorToken : o.scope === "rowMarker" && !a && (a = o.colorToken));
	}
	return {
		rowColor: i,
		rowMarkerColor: a,
		cellColors: r
	};
}
function at(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n.scope === "column" && !t.has(n.fieldId) && t.set(n.fieldId, n.colorToken);
	return t;
}
function X(e, t) {
	if (t <= 1) return 0;
	let n = t - 1;
	return Math.min(Math.max(e, 1), n);
}
function ot(e, t) {
	return JSON.stringify(e) !== JSON.stringify(t);
}
function st(e, t, n, r) {
	return {
		rowKey: t,
		source: e,
		derivedValues: { ...n },
		aiValues: { ...r }
	};
}
function ct(e, t) {
	let n = Ve();
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
function lt(e = "rule") {
	return pt += 1, `${e}_${Date.now().toString(36)}_${pt.toString(36)}`;
}
function ut(e) {
	return e.length ? J.t("aiTable.engine.filterSummary", { count: e.length }) : null;
}
function dt(e) {
	return e.length ? J.t("aiTable.engine.groupSummary", { count: e.length }) : null;
}
function ft(e, t) {
	if (!e.length) return null;
	if (e.length > 1) return J.t("aiTable.engine.sortSummary", { count: e.length });
	let n = Ze(t, e[0].fieldId);
	return n ? J.t("aiTable.engine.sortSummaryByField", { field: n.label.replace("（Demo派生）", "") }) : J.t("aiTable.engine.sortDefault");
}
var pt = 0;
function mt(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function ht(e, t, n, r, i) {
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
function gt(e) {
	return e.length ? J.t("aiTable.engine.colorSummary", { count: e.length }) : null;
}
//#endregion
//#region src/components/ai-table/ai-table-storage.ts
var _t = "ai-table-plugin:v1";
function vt(e) {
	return `${_t}:${e}:mode`;
}
function yt(e) {
	return `${_t}:${e}:view`;
}
function bt(e) {
	return `${_t}:${e}:ai-values`;
}
function xt(e, t = "classic") {
	if (typeof window > "u") return t;
	try {
		let n = window.localStorage.getItem(vt(e));
		return n === "smart" || n === "classic" ? n : t;
	} catch {
		return t;
	}
}
function St(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(vt(e), t);
	} catch {}
}
function Ct(e) {
	if (typeof window > "u") return null;
	try {
		let t = window.localStorage.getItem(yt(e));
		if (!t) return null;
		let n = JSON.parse(t);
		return {
			...Ve(),
			...n
		};
	} catch {
		return null;
	}
}
function wt(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(yt(e), JSON.stringify(t));
	} catch {}
}
function Tt(e) {
	if (typeof window > "u") return {};
	try {
		let t = window.localStorage.getItem(bt(e));
		if (!t) return {};
		let n = JSON.parse(t);
		return typeof n == "object" && n ? n : {};
	} catch {
		return {};
	}
}
function Et(e, t) {
	if (!(typeof window > "u")) try {
		window.localStorage.setItem(bt(e), JSON.stringify(t));
	} catch {}
}
function Dt(e, t) {
	let n = Tt(e);
	return delete n[t], Et(e, n), n;
}
function Ot(e, t, n, r) {
	let i = Tt(e);
	return i[t] || (i[t] = {}), i[t][n] = r, Et(e, i), i;
}
//#endregion
//#region src/components/ai-table/AITableShellContext.tsx
var kt = n.createContext(null);
function At({ children: e }) {
	let [t, r] = n.useState(null), i = n.useCallback((e) => {
		r(e);
	}, []), a = n.useCallback((e) => {
		r((t) => t?.tableId === e ? null : t);
	}, []), o = n.useMemo(() => ({
		registration: t,
		publish: i,
		clear: a
	}), [
		a,
		i,
		t
	]);
	return /* @__PURE__ */ l(kt.Provider, {
		value: o,
		children: e
	});
}
function jt(e) {
	let t = n.useContext(kt), r = t?.publish, i = t?.clear;
	n.useLayoutEffect(() => {
		r?.(e);
	}, [r, e]), n.useEffect(() => () => i?.(e.tableId), [i, e.tableId]);
}
function Mt() {
	return n.useContext(kt);
}
//#endregion
//#region src/components/ai-table/ai-field-generation.ts
function Nt(e) {
	return e == null ? !0 : typeof e == "string" ? e.trim() === "" : Array.isArray(e) ? e.length === 0 : !1;
}
function Pt(e, t, n) {
	return e.allowEmptyReferencedValues ? [] : e.referencedFieldIds.filter((e) => {
		let r = n.find((t) => t.fieldId === e);
		return !r || Nt(r.getValue(t));
	});
}
function Ft(e, t, n) {
	return Pt(e, t, n).length === 0;
}
function It(e, t, n) {
	let r = e.referencedFieldIds.map((e) => n.find((t) => t.fieldId === e));
	return JSON.stringify([e.allowEmptyReferencedValues, r.map((e) => e?.getValue(t) ?? null)]);
}
//#endregion
//#region src/components/ai-table/AITableProvider.tsx
var Lt = 3e3, Rt = n.createContext(null);
function Z() {
	let e = n.useContext(Rt);
	if (!e) throw Error("useAITable must be used within AITableProvider");
	return e;
}
function zt({ config: e, rows: t, totalCount: r, onQueryChange: i, queryFieldIds: a, defaultMode: o = "classic", modeLock: s, children: c }) {
	let { tableId: u, fields: d, rowKey: f } = e, p = n.useMemo(() => a ? new Set(a) : null, [a]), m = n.useMemo(() => {
		let e = ct(Ct(u), d);
		return p ? {
			...e,
			filters: e.filters.filter((e) => p.has(e.fieldId)),
			sorts: e.sorts.filter((e) => p.has(e.fieldId))
		} : e;
	}, [
		d,
		p,
		u
	]), [h, g] = n.useState(() => s ?? xt(u, o)), [_, v] = n.useState("idle"), [y, b] = n.useState(m), [x, S] = n.useState(m), [C, w] = n.useState(null), [T, E] = n.useState("idle"), [D, O] = n.useState(() => Tt(u)), k = n.useRef(null), A = n.useRef(null), j = n.useRef(/* @__PURE__ */ new Map()), M = n.useRef(/* @__PURE__ */ new Set()), N = n.useMemo(() => ot(y, x), [y, x]), P = n.useMemo(() => ({
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
	]), F = n.useCallback((e) => {
		if (s) {
			A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(s), w(null);
			return;
		}
		if (w(null), e === "smart" && h === "classic") {
			if (A.current !== null) return;
			v("switching-to-smart"), A.current = setTimeout(() => {
				g("smart"), St(u, "smart"), v("idle"), A.current = null;
			}, Lt);
			return;
		}
		A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(e), St(u, e);
	}, [
		h,
		s,
		u
	]);
	n.useEffect(() => {
		s && (A.current !== null && (clearTimeout(A.current), A.current = null), v("idle"), g(s), w(null));
	}, [s]), n.useEffect(() => () => {
		A.current !== null && clearTimeout(A.current);
	}, []);
	let ee = n.useCallback((e) => {
		S((t) => ({
			...t,
			...e
		}));
	}, []), I = n.useCallback((e) => {
		let t = ct({
			...y,
			sorts: p ? e.filter((e) => p.has(e.fieldId)) : e
		}, d);
		b(t), S((e) => ({
			...e,
			sorts: t.sorts
		})), wt(u, t);
	}, [
		d,
		p,
		y,
		u
	]), te = n.useCallback(() => {
		let e = ct(x, d), t = p ? {
			...e,
			filters: e.filters.filter((e) => p.has(e.fieldId)),
			sorts: e.sorts.filter((e) => p.has(e.fieldId))
		} : e;
		b(t), S(t), wt(u, t), O((e) => {
			let n = new Set(t.aiFields.map((e) => e.fieldId)), r = Object.fromEntries(Object.entries(e).filter(([e]) => n.has(e)));
			return Et(u, r), r;
		}), w(null);
	}, [
		x,
		d,
		p,
		u
	]), ne = n.useCallback(() => {
		let e = ct({
			...Ve(),
			aiFields: y.aiFields
		}, d);
		b(e), S(e), wt(u, e), w(null);
	}, [
		d,
		y.aiFields,
		u
	]), L = n.useCallback(() => {
		S(y), w(null);
	}, [y]), R = JSON.stringify([y.filters, y.sorts]);
	n.useEffect(() => {
		!i || k.current === R || (k.current = R, i({
			filters: y.filters,
			sorts: y.sorts
		}));
	}, [
		i,
		y.filters,
		y.sorts,
		R
	]), jt(n.useMemo(() => ({
		tableId: u,
		mode: h,
		modeTransition: _,
		dirty: N,
		setMode: F,
		cancelDraft: L
	}), [
		L,
		N,
		h,
		_,
		F,
		u
	]));
	let re = n.useCallback((e) => {
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
			formatValue: (e) => Vt(e)
		}));
		return [...d, ...t];
	}, [
		D,
		d,
		f
	]), z = n.useMemo(() => re(y.aiFields), [re, y.aiFields]), ie = n.useMemo(() => re(x.aiFields), [re, x.aiFields]), B = n.useMemo(() => i ? t : $e(t, y.filters, z), [
		z,
		i,
		t,
		y.filters
	]), ae = n.useMemo(() => i ? B : et(B, y.sorts, z), [
		z,
		B,
		i,
		y.sorts
	]), oe = n.useMemo(() => Bt(y.groups, x.groups) ? x.collapsedGroupKeys : y.collapsedGroupKeys, [
		x.collapsedGroupKeys,
		x.groups,
		y.collapsedGroupKeys,
		y.groups
	]), V = n.useMemo(() => nt(ae, y.groups, z, oe), [
		z,
		oe,
		y.groups,
		ae
	]), se = n.useMemo(() => {
		if (!V.length) return ae;
		let e = [], t = (n) => {
			for (let r of n) r.collapsed || (r.children?.length ? t(r.children) : e.push(...r.rows));
		};
		return t(V), e;
	}, [V, ae]), ce = n.useMemo(() => t.map((e) => {
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
		t,
		y.aiFields
	]), { rowColors: le, rowMarkerColors: ue, cellColors: de, columnColors: fe } = n.useMemo(() => {
		let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
		for (let r of B) {
			let i = f(r), a = it(r, y.colorRules, z);
			a.rowColor && e.set(i, a.rowColor), a.rowMarkerColor && t.set(i, a.rowMarkerColor), a.cellColors.size && n.set(i, a.cellColors);
		}
		return {
			rowColors: e,
			rowMarkerColors: t,
			cellColors: n,
			columnColors: at(y.colorRules)
		};
	}, [
		z,
		B,
		f,
		y.colorRules
	]), H = n.useCallback(async (t, n, r) => {
		let i = n.filter((e) => Ft(t, e, r)), a = n.filter((e) => !Ft(t, e, r)).map(f), o = i.length ? await e.aiAdapter.previewAIField({
			definition: t,
			rows: i,
			rowKey: f,
			fields: r
		}) : [];
		O((e) => {
			let n = {
				...e,
				[t.fieldId]: { ...e[t.fieldId] ?? {} }
			};
			for (let e of a) delete n[t.fieldId][e];
			for (let e of o) e.error || (n[t.fieldId][e.rowKey] = e.value);
			return Et(u, n), n;
		});
	}, [
		e.aiAdapter,
		f,
		u
	]), U = n.useCallback(async (e) => {
		await H(e, B, ie);
		let t = {
			...x,
			aiFields: [...x.aiFields.filter((t) => t.fieldId !== e.fieldId), e]
		};
		S(t), b(t), wt(u, t), w(null);
	}, [
		ie,
		x,
		H,
		B,
		u
	]), pe = n.useCallback(async (e) => {
		let t = x.aiFields.find((t) => t.fieldId === e);
		t && await H(t, B, ie);
	}, [
		ie,
		x.aiFields,
		H,
		B
	]);
	n.useEffect(() => {
		let e = y.aiFields.filter((e) => e.autoUpdate), n = new Set(e.map((e) => e.fieldId));
		for (let e of j.current.keys()) n.has(e) || j.current.delete(e);
		for (let n of e) {
			if (M.current.has(n.fieldId)) continue;
			let e = j.current.get(n.fieldId), r = new Map(t.map((e) => [f(e), It(n, e, z)])), i = t.filter((t) => {
				let n = f(t);
				return !e || e.get(n) !== r.get(n);
			});
			j.current.set(n.fieldId, r), i.length && (M.current.add(n.fieldId), H(n, i, z).catch(() => {
				E("error");
			}).finally(() => {
				M.current.delete(n.fieldId);
			}));
		}
	}, [
		D,
		z,
		H,
		f,
		t,
		y.aiFields
	]);
	let me = n.useCallback((e) => {
		S((t) => ({
			...t,
			aiFields: t.aiFields.filter((t) => t.fieldId !== e),
			filters: t.filters.filter((t) => t.fieldId !== e),
			groups: t.groups.filter((t) => t.fieldId !== e),
			sorts: t.sorts.filter((t) => t.fieldId !== e),
			colorRules: t.colorRules.filter((t) => t.fieldId !== e)
		})), O(Dt(u, e));
	}, [u]), he = {
		config: e,
		state: P,
		rows: t,
		totalCount: r,
		serverQuery: !!i,
		queryFieldIds: a,
		appliedFields: z,
		draftFields: ie,
		setMode: F,
		updateDraft: ee,
		updateSorts: I,
		saveView: te,
		restoreDefaultView: ne,
		cancelDraft: L,
		setActivePanel: w,
		setGenerationState: E,
		createAIField: U,
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
		columnColors: fe,
		aiValues: D
	};
	return /* @__PURE__ */ l(Rt.Provider, {
		value: he,
		children: c
	});
}
function Bt(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function Vt(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "HIGH" ? J.t("aiTable.badge.highRisk") : t === "MEDIUM" ? J.t("aiTable.badge.mediumRisk") : t === "LOW" ? J.t("aiTable.badge.lowRisk") : t === "ATTENTION" ? J.t("aiTable.badge.attention") : t === "NORMAL" ? J.t("aiTable.badge.normal") : String(e ?? "");
}
//#endregion
//#region src/lib/utils.ts
function Q(...e) {
	return Se(G(e));
}
//#endregion
//#region src/components/ui/button.tsx
var Ht = H("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
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
	return /* @__PURE__ */ l(r ? ye.Root : "button", {
		"data-slot": "button",
		"data-variant": t,
		"data-size": n,
		className: Q(Ht({
			variant: t,
			size: n,
			className: e
		})),
		...i
	});
}
//#endregion
//#region src/lib/overlay-hide-guard.ts
function Ut(e, t) {
	let n = o(e);
	n.current = e;
	let r = o(t);
	r.current = t, i(() => {
		let e = !1, t = window.setTimeout(() => {
			e = !0;
		}, 0);
		return () => {
			window.clearTimeout(t), e && n.current && r.current?.(!1);
		};
	}, []);
}
//#endregion
//#region src/components/ui/alert-dialog.tsx
function Wt({ ...e }) {
	return Ut(e.open, e.onOpenChange), /* @__PURE__ */ l(U.Root, {
		"data-slot": "alert-dialog",
		...e
	});
}
function Gt({ ...e }) {
	return /* @__PURE__ */ l(U.Portal, {
		"data-slot": "alert-dialog-portal",
		...e
	});
}
function Kt({ className: e, ...t }) {
	return /* @__PURE__ */ l(U.Overlay, {
		"data-slot": "alert-dialog-overlay",
		className: Q("fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", e),
		...t
	});
}
function qt({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ l(Gt, { children: /* @__PURE__ */ u("div", {
		className: "ai-table-plugin",
		children: [/* @__PURE__ */ l(Kt, {}), /* @__PURE__ */ l(U.Content, {
			"data-slot": "alert-dialog-content",
			"data-size": t,
			className: Q("group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
			...n
		})]
	}) });
}
function Jt({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "alert-dialog-header",
		className: Q("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]", e),
		...t
	});
}
function Yt({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "alert-dialog-footer",
		className: Q("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end", e),
		...t
	});
}
function Xt({ className: e, ...t }) {
	return /* @__PURE__ */ l(U.Title, {
		"data-slot": "alert-dialog-title",
		className: Q("font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", e),
		...t
	});
}
function Zt({ className: e, ...t }) {
	return /* @__PURE__ */ l(U.Description, {
		"data-slot": "alert-dialog-description",
		className: Q("text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", e),
		...t
	});
}
function Qt({ className: e, variant: t = "default", size: n = "default", ...r }) {
	return /* @__PURE__ */ l($, {
		variant: t,
		size: n,
		asChild: !0,
		children: /* @__PURE__ */ l(U.Action, {
			"data-slot": "alert-dialog-action",
			className: Q(e),
			...r
		})
	});
}
function $t({ className: e, variant: t = "outline", size: n = "default", ...r }) {
	return /* @__PURE__ */ l($, {
		variant: t,
		size: n,
		asChild: !0,
		children: /* @__PURE__ */ l(U.Cancel, {
			"data-slot": "alert-dialog-cancel",
			className: Q(e),
			...r
		})
	});
}
//#endregion
//#region src/components/ai-table/AITableModeSwitch.tsx
function en({ mode: e, modeTransition: t, dirty: r, setMode: i, cancelDraft: a }) {
	let { t: o } = Y(), [s, d] = n.useState(!1), [f, p] = n.useState(null);
	function m(t) {
		if (t !== e) {
			if (r && e === "smart" && t === "classic") {
				p(t), d(!0);
				return;
			}
			i(t);
		}
	}
	function h() {
		f && (a(), i(f)), d(!1), p(null);
	}
	function g() {
		d(!1), p(null);
	}
	let _ = e === "smart", v = t === "switching-to-smart", y = _ ? "classic" : "smart";
	return /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ u($, {
		type: "button",
		variant: _ ? "default" : "outline",
		size: "sm",
		className: Q("h-8 gap-1.5 px-2.5 text-xs font-medium shadow-none xl:px-3", _ ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary/30 bg-primary/5 text-primary hover:border-primary/45 hover:bg-primary/10 hover:text-primary"),
		"aria-pressed": _,
		"aria-busy": v,
		"aria-label": o(v ? "aiTable.modeSwitch.switchingToSmart" : _ ? "aiTable.modeSwitch.backToClassic" : "aiTable.modeSwitch.switchToSmart"),
		disabled: v,
		onClick: () => m(y),
		children: [
			v ? /* @__PURE__ */ l(te, { className: "size-3.5 animate-spin" }) : l(_ ? ae : B, { className: "size-3.5" }),
			/* @__PURE__ */ l("span", {
				className: "hidden xl:inline",
				children: o(v ? "aiTable.modeSwitch.switching" : _ ? "aiTable.modeSwitch.backToClassic" : "aiTable.modeSwitch.switchToSmart")
			}),
			/* @__PURE__ */ l("span", {
				className: "xl:hidden",
				children: o("aiTable.modeSwitch.aiTable")
			})
		]
	}), /* @__PURE__ */ l(Wt, {
		open: s,
		onOpenChange: d,
		children: /* @__PURE__ */ u(qt, { children: [/* @__PURE__ */ u(Jt, { children: [/* @__PURE__ */ l(Xt, { children: o("aiTable.modeSwitch.discardTitle") }), /* @__PURE__ */ l(Zt, { children: o("aiTable.modeSwitch.discardDescription") })] }), /* @__PURE__ */ u(Yt, { children: [/* @__PURE__ */ l($t, {
			onClick: g,
			children: o("aiTable.modeSwitch.cancel")
		}), /* @__PURE__ */ l(Qt, {
			onClick: h,
			children: o("aiTable.modeSwitch.discardAndSwitch")
		})] })] })
	})] });
}
function tn() {
	let { state: e, setMode: t, cancelDraft: n } = Z();
	return /* @__PURE__ */ l(en, {
		mode: e.mode,
		modeTransition: e.modeTransition,
		dirty: e.dirty,
		setMode: t,
		cancelDraft: n
	});
}
//#endregion
//#region src/components/ai-table/SmartTableSwitchingLoader.tsx
var nn = [
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
], rn = [
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
], an = [{
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
}], on = [
	"capabilityUnderstanding",
	"capabilityFiltering",
	"capabilityGrouping",
	"capabilityView"
];
function sn({ highlight: e, order: t, upstream: n, type: r, status: i, supplier: a, quantity: o, time: s, ai: c }) {
	return /* @__PURE__ */ u("tr", {
		className: e ? "smart-table-ai-highlight" : void 0,
		children: [
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: "smart-table-mini-checkbox" }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${t}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${n}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${r}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${i}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${a}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${o}` }) }),
			/* @__PURE__ */ l("td", { children: /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${s}` }) }),
			/* @__PURE__ */ l("td", {
				className: "smart-table-ai-column-cell",
				children: /* @__PURE__ */ u("div", {
					className: "smart-table-cell-flex",
					children: [/* @__PURE__ */ l("span", {
						className: "smart-table-mini-ai-spark",
						children: "AI"
					}), /* @__PURE__ */ l("span", { className: `smart-table-skeleton-line ${c}` })]
				})
			})
		]
	});
}
function cn({ title: e, subtitle: t, statusText: n, askText: r, className: i = "" }) {
	let { t: a } = Y(), o = e ?? a("aiTable.loader.title"), s = t ?? a("aiTable.loader.subtitle"), c = n ?? a("aiTable.loader.statusText"), d = r ?? a("aiTable.loader.askText");
	return /* @__PURE__ */ l("section", {
		className: `smart-table-loader-card ${i}`,
		children: /* @__PURE__ */ u("div", {
			className: "smart-table-loader-inner",
			children: [
				/* @__PURE__ */ l("div", { className: "smart-table-bg" }),
				/* @__PURE__ */ l("div", { className: "smart-table-shimmer" }),
				/* @__PURE__ */ u("div", {
					className: "smart-table-content",
					children: [
						/* @__PURE__ */ u("header", {
							className: "smart-table-loader-header",
							children: [/* @__PURE__ */ u("div", {
								className: "smart-table-loader-title-group",
								children: [/* @__PURE__ */ l("div", {
									className: "smart-table-ai-mark",
									children: "AI"
								}), /* @__PURE__ */ u("div", {
									className: "smart-table-loader-copy",
									children: [/* @__PURE__ */ u("div", {
										className: "smart-table-loader-title",
										children: [o, /* @__PURE__ */ l("span", { className: "smart-table-dots" })]
									}), /* @__PURE__ */ l("div", {
										className: "smart-table-loader-subtitle",
										children: s
									})]
								})]
							}), /* @__PURE__ */ u("div", {
								className: "smart-table-status-pill",
								children: [/* @__PURE__ */ l("span", { className: "smart-table-status-dot" }), c]
							})]
						}),
						/* @__PURE__ */ u("section", {
							className: "smart-table-toolbar",
							children: [/* @__PURE__ */ u("div", {
								className: "smart-table-ask-row",
								children: [
									/* @__PURE__ */ u("div", {
										className: "smart-table-ask-input",
										children: [/* @__PURE__ */ l("span", { className: "smart-table-ask-prefix-dot" }), /* @__PURE__ */ l("span", {
											className: "smart-table-ask-text",
											children: d
										})]
									}),
									/* @__PURE__ */ l("div", {
										className: "smart-table-toolbar-btn secondary",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ l("div", {
										className: "smart-table-toolbar-btn",
										"aria-hidden": "true"
									})
								]
							}), /* @__PURE__ */ u("div", {
								className: "smart-table-view-row",
								children: [/* @__PURE__ */ l("span", {
									className: "smart-table-view-label",
									children: a("aiTable.loader.smartView")
								}), nn.map((e) => /* @__PURE__ */ u("span", {
									className: `smart-table-view-chip ${e.type}`,
									children: [/* @__PURE__ */ l("span", { className: "smart-table-view-dot" }), a(`aiTable.loader.${e.key}`)]
								}, e.key))]
							})]
						}),
						/* @__PURE__ */ u("section", {
							className: "smart-table-shell",
							children: [
								/* @__PURE__ */ u("div", {
									className: "smart-table-topbar",
									children: [/* @__PURE__ */ u("div", {
										className: "smart-table-topbar-left",
										children: [
											/* @__PURE__ */ l("span", { className: "smart-table-mini-checkbox" }),
											/* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-md" }),
											/* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" })
										]
									}), /* @__PURE__ */ u("div", {
										className: "smart-table-topbar-right",
										children: [
											/* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" }),
											/* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-md" }),
											/* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-xs" })
										]
									})]
								}),
								/* @__PURE__ */ u("table", {
									className: "smart-table-skeleton",
									"aria-label": "smart table switching skeleton",
									children: [
										/* @__PURE__ */ u("colgroup", { children: [
											/* @__PURE__ */ l("col", { style: { width: 46 } }),
											/* @__PURE__ */ l("col", { style: { width: "15%" } }),
											/* @__PURE__ */ l("col", { style: { width: "13%" } }),
											/* @__PURE__ */ l("col", { style: { width: "11%" } }),
											/* @__PURE__ */ l("col", { style: { width: "11%" } }),
											/* @__PURE__ */ l("col", { style: { width: "14%" } }),
											/* @__PURE__ */ l("col", { style: { width: "12%" } }),
											/* @__PURE__ */ l("col", { style: { width: "15%" } }),
											/* @__PURE__ */ l("col", { style: { width: "13%" } })
										] }),
										/* @__PURE__ */ l("thead", { children: /* @__PURE__ */ u("tr", { children: [
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-mini-checkbox" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" }) }),
											/* @__PURE__ */ l("th", { children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-md" }) }),
											/* @__PURE__ */ l("th", {
												className: "smart-table-ai-column",
												children: /* @__PURE__ */ l("span", { className: "smart-table-skeleton-line line-sm" })
											})
										] }) }),
										/* @__PURE__ */ u("tbody", { children: [
											/* @__PURE__ */ l("tr", {
												className: "smart-table-group-row",
												children: /* @__PURE__ */ l("td", {
													colSpan: 9,
													children: /* @__PURE__ */ u("div", {
														className: "smart-table-group-label",
														children: [
															/* @__PURE__ */ l("span", { className: "smart-table-group-label-dot" }),
															a("aiTable.loader.creatingGroup"),
															/* @__PURE__ */ l("span", { className: "smart-table-group-line" })
														]
													})
												})
											}),
											rn.map((e, t) => /* @__PURE__ */ l(sn, { ...e }, t)),
											/* @__PURE__ */ l("tr", {
												className: "smart-table-group-row",
												children: /* @__PURE__ */ l("td", {
													colSpan: 9,
													children: /* @__PURE__ */ u("div", {
														className: "smart-table-group-label",
														children: [
															/* @__PURE__ */ l("span", { className: "smart-table-group-label-dot" }),
															a("aiTable.loader.generatingView"),
															/* @__PURE__ */ l("span", { className: "smart-table-group-line" })
														]
													})
												})
											}),
											an.map((e, t) => /* @__PURE__ */ l(sn, { ...e }, `second-${t}`))
										] })
									]
								}),
								/* @__PURE__ */ u("div", {
									className: "smart-table-footer-status",
									children: [/* @__PURE__ */ l("div", {
										className: "smart-table-capability-chips",
										children: on.map((e) => /* @__PURE__ */ u("span", {
											className: "smart-table-capability-chip",
											children: [/* @__PURE__ */ l("span", { className: "smart-table-capability-dot" }), a(`aiTable.loader.${e}`)]
										}, e))
									}), /* @__PURE__ */ u("div", {
										className: "smart-table-progress-group",
										children: [/* @__PURE__ */ l("span", {
											className: "smart-table-progress-text",
											children: "Upgrading table"
										}), /* @__PURE__ */ l("span", { className: "smart-table-mini-progress" })]
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
function ln() {
	let e = Mt()?.registration;
	return e ? /* @__PURE__ */ l(en, {
		mode: e.mode,
		modeTransition: e.modeTransition,
		dirty: e.dirty,
		setMode: e.setMode,
		cancelDraft: e.cancelDraft
	}) : null;
}
//#endregion
//#region src/components/ai-table/AITableVisibility.tsx
function un({ children: e }) {
	let { state: t } = Z();
	return t.mode === "classic" && t.modeTransition === "idle" ? /* @__PURE__ */ l(c, { children: e }) : null;
}
function dn({ title: e, actions: t }) {
	return /* @__PURE__ */ u("div", {
		className: "flex min-h-10 items-center justify-between gap-4",
		children: [/* @__PURE__ */ l("h1", {
			className: "text-lg font-semibold",
			children: e
		}), t]
	});
}
//#endregion
//#region src/components/ui/popover.tsx
var fn = null;
function pn({ ...e }) {
	return /* @__PURE__ */ l(_e.Root, {
		"data-slot": "popover",
		...e
	});
}
function mn({ onClick: e, onPointerDown: t, onKeyDown: n, ...r }) {
	function i(e) {
		fn = e.currentTarget;
	}
	return /* @__PURE__ */ l(_e.Trigger, {
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
function hn({ className: e, align: t = "center", sideOffset: r = 4, style: i, ...a }) {
	let o = n.useRef(null), [s, c] = n.useState(null), u = a.side ?? "bottom";
	n.useLayoutEffect(() => {
		let e = () => {
			let e = fn, n = o.current;
			if (!e || !n) return;
			let i = e.getBoundingClientRect(), a = n.getBoundingClientRect(), s = r, l = window.innerWidth, d = window.innerHeight, f = Math.max(120, d - i.bottom - s - 8), p = Math.max(120, i.top - s - 8), m = u === "bottom" && (f >= Math.min(n.scrollHeight, 320) || f >= p), h = m ? f : p, g = m ? i.bottom + s : i.top - Math.min(n.scrollHeight, h) - s, _ = t === "end" ? i.right - a.width : t === "center" ? i.left + (i.width - a.width) / 2 : i.left, v = Math.min(Math.max(8, _), Math.max(8, l - a.width - 8));
			c({
				top: Math.max(8, Math.min(g, d - Math.min(a.height, h) - 8)),
				left: v,
				availableHeight: h
			});
		};
		e();
		let n = o.current ? new ResizeObserver(e) : null;
		o.current && n?.observe(o.current);
		let i = (t) => {
			let n = t.target;
			n instanceof Node && o.current?.contains(n) || e();
		};
		return window.addEventListener("resize", e), window.addEventListener("scroll", i, !0), () => {
			n?.disconnect(), window.removeEventListener("resize", e), window.removeEventListener("scroll", i, !0);
		};
	}, [
		t,
		u,
		r
	]);
	let d = fn?.getBoundingClientRect(), f = d ? {
		top: d.bottom + r,
		left: d.left,
		availableHeight: Math.max(120, window.innerHeight - d.bottom - r - 8)
	} : {
		top: 120,
		left: 80,
		availableHeight: Math.max(120, typeof window > "u" ? 680 : window.innerHeight - 128)
	};
	return /* @__PURE__ */ l(_e.Portal, {
		container: typeof document > "u" ? void 0 : document.body,
		children: /* @__PURE__ */ l("div", {
			className: "ai-table-plugin",
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 2147483e3,
				pointerEvents: "none"
			},
			children: /* @__PURE__ */ l(_e.Content, {
				ref: o,
				"data-slot": "popover-content",
				align: t,
				sideOffset: r,
				style: {
					...i,
					position: "fixed",
					top: s?.top ?? f.top,
					left: s?.left ?? f.left,
					maxHeight: s?.availableHeight ?? f.availableHeight,
					"--radix-popover-content-available-height": `${s?.availableHeight ?? f.availableHeight}px`,
					transform: "none",
					zIndex: 2147483e3,
					pointerEvents: "auto"
				},
				className: Q("z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
				...a
			})
		})
	});
}
//#endregion
//#region src/components/ui/select.tsx
function gn({ ...e }) {
	return /* @__PURE__ */ l(W.Root, {
		"data-slot": "select",
		...e
	});
}
function _n({ ...e }) {
	return /* @__PURE__ */ l(W.Group, {
		"data-slot": "select-group",
		...e
	});
}
function vn({ ...e }) {
	return /* @__PURE__ */ l(W.Value, {
		"data-slot": "select-value",
		...e
	});
}
function yn({ className: e, size: t = "default", children: n, ...r }) {
	return /* @__PURE__ */ u(W.Trigger, {
		"data-slot": "select-trigger",
		"data-size": t,
		className: Q("flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none", "data-[size=default]:h-9 data-[size=sm]:h-8", "data-[placeholder]:text-muted-foreground", "disabled:cursor-not-allowed disabled:opacity-50", "dark:bg-input/30 dark:hover:bg-input/50", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", e),
		...r,
		children: [n, /* @__PURE__ */ l(W.Icon, {
			asChild: !0,
			children: /* @__PURE__ */ l(b, { className: "size-4 opacity-50" })
		})]
	});
}
function bn({ className: e, children: t, position: n = "popper", align: r = "center", ...i }) {
	return /* @__PURE__ */ l(c, { children: /* @__PURE__ */ u(W.Content, {
		"data-slot": "select-content",
		className: Q("relative z-50 max-h-[min(14rem,var(--radix-select-content-available-height))] min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", n === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", e),
		position: n,
		align: r,
		...i,
		children: [
			/* @__PURE__ */ l(Sn, {}),
			/* @__PURE__ */ l(W.Viewport, {
				className: Q("p-1", n === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
				children: t
			}),
			/* @__PURE__ */ l(Cn, {})
		]
	}) });
}
function xn({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ u(W.Item, {
		"data-slot": "select-item",
		className: Q("relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden", "focus:bg-accent focus:text-accent-foreground", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", e),
		...n,
		children: [/* @__PURE__ */ l("span", {
			"data-slot": "select-item-indicator",
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ l(W.ItemIndicator, { children: /* @__PURE__ */ l(v, { className: "size-4" }) })
		}), /* @__PURE__ */ l(W.ItemText, { children: t })]
	});
}
function Sn({ className: e, ...t }) {
	return /* @__PURE__ */ l(W.ScrollUpButton, {
		"data-slot": "select-scroll-up-button",
		className: Q("flex cursor-default items-center justify-center py-1", e),
		...t,
		children: /* @__PURE__ */ l(C, { className: "size-4" })
	});
}
function Cn({ className: e, ...t }) {
	return /* @__PURE__ */ l(W.ScrollDownButton, {
		"data-slot": "select-scroll-down-button",
		className: Q("flex cursor-default items-center justify-center py-1", e),
		...t,
		children: /* @__PURE__ */ l(b, { className: "size-4" })
	});
}
//#endregion
//#region src/components/ai-table/FieldTypeIcon.tsx
var wn = {
	text: {
		icon: le,
		label: "Text",
		color: "text-muted-foreground"
	},
	number: {
		icon: N,
		label: "Number",
		color: "text-blue-500"
	},
	tag: {
		icon: oe,
		label: "Tag",
		color: "text-purple-500"
	},
	date: {
		icon: h,
		label: "Date",
		color: "text-green-500"
	},
	datetime: {
		icon: O,
		label: "DateTime",
		color: "text-green-500"
	}
};
function Tn({ type: e, className: t, showLabel: n = !1 }) {
	let r = wn[e], i = r.icon;
	return /* @__PURE__ */ u("span", {
		className: Q("inline-flex items-center gap-1", t),
		children: [/* @__PURE__ */ l(i, { className: Q("size-3.5 shrink-0", r.color) }), n && /* @__PURE__ */ l("span", {
			className: Q("text-[10px] font-medium", r.color),
			children: r.label
		})]
	});
}
function En({ fieldId: e, label: t, type: n, disabled: r }) {
	return /* @__PURE__ */ l(xn, {
		value: e,
		disabled: r,
		children: /* @__PURE__ */ u("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ l(Tn, { type: n }), /* @__PURE__ */ l("span", { children: t })]
		})
	}, e);
}
//#endregion
//#region src/components/ui/input.tsx
function Dn({ className: e, type: t, ...n }) {
	return /* @__PURE__ */ l("input", {
		type: t,
		"data-slot": "input",
		className: Q("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm", "selection:bg-primary selection:text-primary-foreground", "placeholder:text-muted-foreground", "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground", "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", "dark:bg-input/30", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", e),
		...n
	});
}
//#endregion
//#region src/components/ai-table/AITablePanelParts.tsx
function On({ title: e, actions: t }) {
	return /* @__PURE__ */ u("div", {
		className: "flex items-center justify-between border-b px-4 py-3",
		children: [/* @__PURE__ */ u("div", {
			className: "flex items-center gap-1.5 text-sm font-semibold",
			children: [e, /* @__PURE__ */ l(P, { className: "size-3.5 text-muted-foreground" })]
		}), t]
	});
}
function kn({ value: e, onChange: t, onSubmit: n, placeholder: r, loading: i, disabled: a }) {
	let { t: o } = Y();
	return /* @__PURE__ */ u("div", {
		className: Q("flex items-center gap-2 rounded-lg border bg-card px-2 shadow-sm transition-colors", i && "bg-muted/30"),
		children: [
			/* @__PURE__ */ l("span", {
				className: "flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ l(m, { className: "size-3.5" })
			}),
			/* @__PURE__ */ l(Dn, {
				value: e,
				onChange: (e) => t(e.target.value),
				onKeyDown: (e) => {
					e.key === "Enter" && !e.nativeEvent.isComposing && n();
				},
				placeholder: r,
				disabled: i || a,
				className: "h-10 flex-1 border-0 px-0 text-sm shadow-none focus:!shadow-none focus-visible:!shadow-none focus-visible:!ring-0"
			}),
			e ? /* @__PURE__ */ l($, {
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
function An({ primaryLabel: e }) {
	let { t } = Y(), { saveView: n, cancelDraft: r } = Z();
	return /* @__PURE__ */ u("div", {
		className: "flex items-center justify-end gap-2 border-t px-4 py-3",
		children: [/* @__PURE__ */ l($, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: r,
			children: t("aiTable.panelParts.cancel")
		}), /* @__PURE__ */ l($, {
			type: "button",
			size: "sm",
			onClick: n,
			children: e ?? t("aiTable.panelParts.save")
		})]
	});
}
//#endregion
//#region src/components/ai-table/AITableValueEditor.tsx
function jn({ field: e, operator: t, value: n, onChange: r, className: i }) {
	let { t: a } = Y();
	if (!e || [
		"isEmpty",
		"notEmpty",
		"isToday",
		"isPast",
		"isFuture"
	].includes(t)) return /* @__PURE__ */ l("div", { className: i });
	if (e.options?.length) return /* @__PURE__ */ u(gn, {
		value: e.options.some((e) => String(e.value) === String(n)) ? String(n) : void 0,
		onValueChange: (t) => {
			let n = e.options?.find((e) => String(e.value) === t);
			r(n?.value ?? t);
		},
		children: [/* @__PURE__ */ l(yn, {
			className: i,
			children: /* @__PURE__ */ l(vn, { placeholder: a("aiTable.valueEditor.selectPlaceholder") })
		}), /* @__PURE__ */ l(bn, { children: e.options.map((e) => /* @__PURE__ */ l(xn, {
			value: String(e.value),
			children: e.label
		}, String(e.value))) })]
	});
	if (t === "withinPastDays" || t === "withinNextDays") return /* @__PURE__ */ l(Dn, {
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
		return /* @__PURE__ */ u("div", {
			className: `flex min-w-0 items-center gap-1.5 ${i ?? ""}`,
			children: [
				/* @__PURE__ */ l(Dn, {
					className: "min-w-0 flex-1",
					type: o,
					value: String(t[0] ?? ""),
					onChange: (n) => r([Mn(e.type, n.target.value), t[1] ?? ""]),
					"aria-label": a("aiTable.valueEditor.rangeStart")
				}),
				/* @__PURE__ */ l("span", {
					className: "shrink-0 text-xs text-muted-foreground",
					children: a("aiTable.valueEditor.rangeTo")
				}),
				/* @__PURE__ */ l(Dn, {
					className: "min-w-0 flex-1",
					type: o,
					value: String(t[1] ?? ""),
					onChange: (n) => r([t[0] ?? "", Mn(e.type, n.target.value)]),
					"aria-label": a("aiTable.valueEditor.rangeEnd")
				})
			]
		});
	}
	return /* @__PURE__ */ l(Dn, {
		className: i,
		type: e.type === "number" ? "number" : e.type === "date" ? "date" : e.type === "datetime" ? "datetime-local" : "text",
		inputMode: e.type === "number" ? "decimal" : void 0,
		placeholder: e.type === "text" || e.type === "tag" ? a("aiTable.valueEditor.inputPlaceholder") : void 0,
		value: String(n ?? ""),
		onChange: (t) => r(Mn(e.type, t.target.value))
	});
}
function Mn(e, t) {
	return e === "number" ? t === "" ? "" : Number(t) : t;
}
//#endregion
//#region src/components/ai-table/AIColorControls.tsx
function Nn({ value: e, onChange: t }) {
	let { t: r } = Y(), [i, a] = n.useState(!1), o = n.useRef(null), s = Je(e);
	return Ln(o, i, () => a(!1)), /* @__PURE__ */ u("div", {
		ref: o,
		className: "relative shrink-0",
		children: [/* @__PURE__ */ l($, {
			type: "button",
			variant: "outline",
			size: "icon",
			className: "size-9",
			"aria-label": r("aiTable.color.selectColor", { label: s.label }),
			"aria-haspopup": "dialog",
			"aria-expanded": i,
			onClick: () => a((e) => !e),
			children: /* @__PURE__ */ l("span", {
				className: "size-5 rounded-md border border-black/8",
				style: { backgroundColor: s.backgroundColor }
			})
		}), i ? /* @__PURE__ */ u("div", {
			role: "dialog",
			"aria-label": r("aiTable.color.backgroundFill"),
			className: "absolute left-0 top-full z-70 mt-2 w-[380px] rounded-xl border bg-popover p-4 shadow-xl",
			onKeyDown: (e) => {
				e.key === "Escape" && a(!1);
			},
			children: [/* @__PURE__ */ l("p", {
				className: "mb-3 text-sm font-semibold",
				children: r("aiTable.color.backgroundFill")
			}), /* @__PURE__ */ l("div", {
				className: "space-y-2",
				children: We.map((n, r) => /* @__PURE__ */ l("div", {
					className: "grid grid-cols-11 gap-2",
					children: n.map((n) => {
						let r = Je(e).value === n.value;
						return /* @__PURE__ */ l("button", {
							type: "button",
							"aria-label": n.label,
							"aria-pressed": r,
							className: Q("relative size-7 rounded-md border border-black/5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", r && "ring-2 ring-primary ring-offset-2"),
							style: { backgroundColor: n.backgroundColor },
							onClick: () => {
								t(n.value), a(!1);
							},
							children: r ? /* @__PURE__ */ l(g, {
								className: "absolute inset-0 m-auto size-3.5",
								style: { color: n.foregroundColor }
							}) : null
						}, n.value);
					})
				}, r))
			})]
		}) : null]
	});
}
var Pn = [
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
function Fn({ value: e, onChange: t }) {
	let { t: r } = Y(), [i, a] = n.useState(!1), [o, s] = n.useState(e), c = n.useRef(null), d = Pn.find((t) => t.value === e) ?? Pn[0], f = Pn.find((e) => e.value === o) ?? d;
	Ln(c, i, () => a(!1));
	let p = r(d.labelKey), m = r(f.titleKey), h = r(f.descKey);
	return /* @__PURE__ */ u("div", {
		ref: c,
		className: "relative shrink-0",
		children: [/* @__PURE__ */ u($, {
			type: "button",
			variant: "outline",
			className: "h-9 w-24 justify-between px-3 font-normal",
			"aria-label": r("aiTable.color.selectScope", { label: p }),
			"aria-haspopup": "menu",
			"aria-expanded": i,
			onClick: () => {
				s(e), a((e) => !e);
			},
			children: [p, /* @__PURE__ */ l(y, { className: "size-4 text-muted-foreground" })]
		}), i ? /* @__PURE__ */ u("div", {
			className: "absolute left-0 top-full z-60 mt-2 flex w-[560px] items-start gap-2",
			children: [/* @__PURE__ */ l("div", {
				role: "menu",
				"aria-label": r("aiTable.color.scopeMenu"),
				className: "w-36 rounded-xl border bg-popover p-1.5 shadow-xl",
				children: Pn.map((n) => /* @__PURE__ */ u("button", {
					type: "button",
					role: "menuitemradio",
					"aria-checked": n.value === e,
					className: Q("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm outline-none hover:bg-muted focus:bg-muted", n.value === o && "bg-muted", n.value === e && "bg-primary/8"),
					onPointerEnter: () => s(n.value),
					onFocus: () => s(n.value),
					onClick: () => {
						t(n.value), a(!1);
					},
					children: [r(n.labelKey), n.value === e ? /* @__PURE__ */ l(g, { className: "size-4 text-primary" }) : null]
				}, n.value))
			}), /* @__PURE__ */ u("div", {
				className: "w-[416px] rounded-xl bg-[#484a58] p-4 text-white shadow-xl",
				children: [
					/* @__PURE__ */ l("p", {
						className: "text-base font-semibold",
						children: m
					}),
					/* @__PURE__ */ l("p", {
						className: "mt-1 text-sm leading-5 text-white/65",
						children: h
					}),
					/* @__PURE__ */ l(In, { scope: f.value })
				]
			})]
		}) : null]
	});
}
function In({ scope: e }) {
	let { t } = Y();
	return /* @__PURE__ */ l("div", {
		className: "mt-4 overflow-hidden rounded-lg border border-white/25 bg-card text-foreground",
		children: /* @__PURE__ */ u("table", {
			className: "w-full table-fixed text-[10px]",
			children: [/* @__PURE__ */ l("thead", { children: /* @__PURE__ */ u("tr", {
				className: "border-b bg-muted/70 text-muted-foreground",
				children: [
					/* @__PURE__ */ l("th", {
						className: "w-1/2 px-2 py-1.5 text-left font-medium",
						children: /* @__PURE__ */ u("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ l(ee, { className: "size-3" }), t("aiTable.colorScope.previewTask")]
						})
					}),
					/* @__PURE__ */ l("th", {
						className: Q("px-2 py-1.5 text-left font-medium", e === "column" && "bg-purple-100"),
						children: /* @__PURE__ */ u("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ l(N, { className: "size-3" }), t("aiTable.colorScope.previewPriority")]
						})
					}),
					/* @__PURE__ */ l("th", {
						className: "px-2 py-1.5 text-left font-medium",
						children: /* @__PURE__ */ u("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ l(ue, { className: "size-3" }), t("aiTable.colorScope.previewStatus")]
						})
					})
				]
			}) }), /* @__PURE__ */ l("tbody", { children: [
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
			].map((t, n) => /* @__PURE__ */ u("tr", {
				className: Q("border-b last:border-b-0", e === "row" && (n === 0 || n === 3) && "bg-red-50"),
				children: [
					/* @__PURE__ */ u("td", {
						className: "relative truncate px-2 py-1.5",
						children: [e === "rowMarker" ? /* @__PURE__ */ l("span", { className: Q("absolute inset-y-0 left-0 w-0.5", n % 2 ? "bg-amber-400" : "bg-primary") }) : null, t[0]]
					}),
					/* @__PURE__ */ l("td", {
						className: Q("px-2 py-1.5", e === "cell" && (n === 1 || n === 3) && "bg-red-100", e === "column" && "bg-purple-100"),
						children: t[1]
					}),
					/* @__PURE__ */ l("td", {
						className: "px-2 py-1.5",
						children: t[2]
					})
				]
			}, t[0])) })]
		})
	});
}
function Ln(e, t, r) {
	n.useEffect(() => {
		if (!t) return;
		let n = (t) => {
			e.current?.contains(t.target) || r();
		};
		return document.addEventListener("pointerdown", n), () => document.removeEventListener("pointerdown", n);
	}, [
		r,
		t,
		e
	]);
}
//#endregion
//#region src/components/ai-table/AIColorPanel.tsx
function Rn() {
	let { t: e } = Y(), { config: t, draftFields: r, state: i, updateDraft: a, setGenerationState: o } = Z(), s = i.draftView.colorRules, d = r.filter((e) => e.colorable), [f, p] = n.useState(""), [m, h] = n.useState(null), g = i.generationState === "generating", [_, v] = n.useState(null);
	async function y() {
		if (!(!f.trim() || g)) {
			o("generating");
			try {
				let n = await t.aiAdapter.generateColorRules({
					instruction: f,
					fields: r
				});
				n.length ? (a({ colorRules: [...s, ...n] }), h(e("aiTable.color.generated", { count: n.length }))) : h(e("aiTable.color.noRules")), o("success");
			} catch (t) {
				let n = t instanceof Error ? t.message : typeof t == "string" ? t : "";
				h(n || e("aiTable.color.generateFailed")), o("error");
			}
		}
	}
	function b() {
		let e = d.find((e) => /shortage|缺货/i.test(`${e.fieldId} ${e.label}`)) ?? d.find((e) => e.source === "derived") ?? d[0];
		e && a({ colorRules: [...s, {
			id: lt("color"),
			scope: "cell",
			fieldId: e.fieldId,
			operator: e.type === "number" ? "greaterThan" : "equals",
			value: e.type === "number" ? 0 : "",
			colorToken: "red"
		}] });
	}
	function x(e, t) {
		a({ colorRules: s.map((n) => n.id === e ? {
			...n,
			...t
		} : n) });
	}
	function S(e) {
		if (_ == null || _ === e) return;
		let t = [...s], [n] = t.splice(_, 1);
		t.splice(e, 0, n), a({ colorRules: t }), v(e);
	}
	return /* @__PURE__ */ u("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ l(On, { title: e("aiTable.color.title") }),
			/* @__PURE__ */ u("div", {
				className: "space-y-4 p-4",
				children: [
					/* @__PURE__ */ l(kn, {
						value: f,
						onChange: p,
						onSubmit: y,
						loading: g,
						placeholder: e("aiTable.color.placeholder")
					}),
					g ? /* @__PURE__ */ u("p", {
						className: "flex items-center gap-2 text-xs text-primary",
						children: [/* @__PURE__ */ l(I, { className: "size-3.5 animate-spin" }), e("aiTable.color.generating")]
					}) : null,
					m && !g ? /* @__PURE__ */ l("p", {
						className: "text-xs text-description",
						children: m
					}) : null,
					/* @__PURE__ */ u("div", { children: [
						/* @__PURE__ */ u("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ l("p", {
								className: "text-xs text-muted-foreground",
								children: e("aiTable.color.ruleDescription")
							}), /* @__PURE__ */ u($, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-7 gap-1 text-xs text-description",
								children: [/* @__PURE__ */ l(B, { className: "size-3.5" }), e("aiTable.color.smartColor")]
							})]
						}),
						/* @__PURE__ */ l("div", {
							className: "space-y-2",
							children: s.map((t, n) => {
								let i = r.find((e) => e.fieldId === t.fieldId), o = i ? He(i.type) : [];
								return /* @__PURE__ */ u("div", {
									onDragOver: (e) => {
										e.preventDefault(), S(n);
									},
									className: "relative flex items-center gap-2",
									children: [
										/* @__PURE__ */ l("button", {
											type: "button",
											draggable: !0,
											className: "flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing",
											"aria-label": e("aiTable.color.dragHint", { index: n + 1 }),
											onDragStart: () => v(n),
											onDragEnd: () => v(null),
											children: /* @__PURE__ */ l(M, { className: "size-4" })
										}),
										/* @__PURE__ */ l(Nn, {
											value: t.colorToken,
											onChange: (e) => x(t.id, { colorToken: e })
										}),
										/* @__PURE__ */ l(Fn, {
											value: t.scope,
											onChange: (e) => x(t.id, { scope: e })
										}),
										/* @__PURE__ */ u(gn, {
											value: t.fieldId,
											onValueChange: (e) => {
												let n = r.find((t) => t.fieldId === e);
												x(t.id, {
													fieldId: e,
													operator: n?.type === "number" ? "greaterThan" : "equals",
													value: n?.type === "number" ? 0 : ""
												});
											},
											children: [/* @__PURE__ */ l(yn, {
												className: "w-40",
												children: /* @__PURE__ */ l(vn, {})
											}), /* @__PURE__ */ l(bn, { children: d.map((e) => /* @__PURE__ */ l(En, {
												fieldId: e.fieldId,
												label: e.label,
												type: e.type
											}, e.fieldId)) })]
										}),
										t.scope === "column" ? /* @__PURE__ */ l("div", {
											className: "flex h-9 min-w-44 flex-1 items-center rounded-md border border-dashed px-3 text-xs text-muted-foreground",
											children: e("aiTable.color.columnHint")
										}) : /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ u(gn, {
											value: t.operator,
											onValueChange: (e) => x(t.id, { operator: e }),
											children: [/* @__PURE__ */ l(yn, {
												className: "w-24",
												children: /* @__PURE__ */ l(vn, {})
											}), /* @__PURE__ */ l(bn, { children: o.map((e) => /* @__PURE__ */ l(xn, {
												value: e.value,
												children: e.label
											}, e.value)) })]
										}), /* @__PURE__ */ l(jn, {
											className: "min-w-20 flex-1",
											field: i,
											operator: t.operator,
											value: t.value,
											onChange: (e) => x(t.id, { value: e })
										})] }),
										/* @__PURE__ */ l($, {
											type: "button",
											variant: "ghost",
											size: "icon",
											className: "size-8 text-muted-foreground",
											"aria-label": e("aiTable.color.deleteRule", { index: n + 1 }),
											onClick: () => a({ colorRules: s.filter((e) => e.id !== t.id) }),
											children: /* @__PURE__ */ l(ce, { className: "size-4" })
										})
									]
								}, t.id);
							})
						}),
						/* @__PURE__ */ u($, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "mt-3 gap-1",
							onClick: b,
							children: [/* @__PURE__ */ l(R, { className: "size-4" }), e("aiTable.color.addRule")]
						})
					] })
				]
			}),
			/* @__PURE__ */ l(An, { primaryLabel: e("aiTable.color.apply") })
		]
	});
}
//#endregion
//#region src/components/ui/badge.tsx
var zn = H("inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3", {
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
function Bn({ className: e, variant: t = "default", asChild: n = !1, ...r }) {
	return /* @__PURE__ */ l(n ? ye.Root : "span", {
		"data-slot": "badge",
		"data-variant": t,
		className: Q(zn({ variant: t }), e),
		...r
	});
}
//#endregion
//#region src/components/ui/checkbox.tsx
function Vn({ className: e, ...t }) {
	return /* @__PURE__ */ l(pe.Root, {
		"data-slot": "checkbox",
		className: Q("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e),
		...t,
		children: /* @__PURE__ */ l(pe.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
			children: /* @__PURE__ */ l(v, {})
		})
	});
}
//#endregion
//#region src/components/ui/tooltip.tsx
function Hn({ delayDuration: e = 0, ...t }) {
	return /* @__PURE__ */ l(xe.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration: e,
		...t
	});
}
function Un({ ...e }) {
	return /* @__PURE__ */ l(xe.Root, {
		"data-slot": "tooltip",
		...e
	});
}
function Wn({ ...e }) {
	return /* @__PURE__ */ l(xe.Trigger, {
		"data-slot": "tooltip-trigger",
		...e
	});
}
function Gn({ className: e, sideOffset: t = 0, children: n, ...r }) {
	return /* @__PURE__ */ l(xe.Portal, { children: /* @__PURE__ */ l("div", {
		className: "ai-table-plugin",
		children: /* @__PURE__ */ u(xe.Content, {
			"data-slot": "tooltip-content",
			sideOffset: t,
			className: Q("z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
			...r,
			children: [n, /* @__PURE__ */ l(xe.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })]
		})
	}) });
}
//#endregion
//#region src/components/ai-table/AIPromptTokenEditor.tsx
var Kn = /\{\{([^}]+)\}\}/g, qn = n.forwardRef(function({ value: e, fields: t, onChange: r, placeholder: i }, a) {
	let { t: o } = Y(), s = n.useRef(null), c = n.useRef(null), u = n.useRef(e), d = n.useMemo(() => new Map(t.map((e) => [e.fieldId, e])), [t]), f = n.useCallback((e) => {
		let t = s.current;
		if (!t) return;
		t.replaceChildren();
		let n = 0;
		for (let r of e.matchAll(Kn)) {
			let i = r.index ?? 0;
			i > n && t.append(document.createTextNode(e.slice(n, i)));
			let a = r[1];
			t.append(Jn(a, d.get(a)?.label ?? a)), n = i + r[0].length;
		}
		n < e.length && t.append(document.createTextNode(e.slice(n)));
	}, [d]);
	n.useLayoutEffect(() => {
		u.current === e && s.current?.childNodes.length || (u.current = e, f(e));
	}, [f, e]);
	let p = n.useCallback(() => {
		let e = Yn(s.current);
		u.current = e, r(e);
	}, [r]), m = n.useCallback(() => {
		let e = s.current, t = window.getSelection();
		if (!e || !t?.rangeCount) return;
		let n = t.getRangeAt(0);
		e.contains(n.commonAncestorContainer) && (c.current = n.cloneRange());
	}, []);
	return n.useImperativeHandle(a, () => ({ insertField(e) {
		let t = s.current;
		if (!t) return;
		t.focus();
		let n = window.getSelection(), r = c.current, i = r && t.contains(r.commonAncestorContainer) ? r : document.createRange();
		(!r || !t.contains(r.commonAncestorContainer)) && (i.selectNodeContents(t), i.collapse(!1)), i.deleteContents();
		let a = Jn(e.fieldId, e.label), o = document.createTextNode("\xA0");
		i.insertNode(o), i.insertNode(a), i.setStartAfter(o), i.collapse(!0), n?.removeAllRanges(), n?.addRange(i), c.current = i.cloneRange(), p();
	} }), [p]), /* @__PURE__ */ l("div", {
		ref: s,
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
function Jn(e, t) {
	let n = document.createElement("span");
	n.dataset.aiFieldToken = e, n.contentEditable = "false", n.className = "mx-0.5 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 align-baseline text-xs font-medium leading-5 text-primary", n.setAttribute("aria-label", J.t("aiTable.aiField.tokenAriaLabel", { label: t }));
	let r = document.createElement("span");
	return r.textContent = "ƒx", r.className = "inline-flex text-[10px] font-semibold opacity-70", n.append(r, document.createTextNode(t)), n;
}
function Yn(e) {
	return e ? Array.from(e.childNodes).map(Xn).join("").replaceAll("\xA0", " ") : "";
}
function Xn(e) {
	if (e.nodeType === Node.TEXT_NODE) return e.textContent ?? "";
	if (!(e instanceof HTMLElement)) return "";
	let t = e.dataset.aiFieldToken;
	if (t) return `{{${t}}}`;
	if (e.tagName === "BR") return "\n";
	let n = Array.from(e.childNodes).map(Xn).join("");
	return e.tagName === "DIV" ? `\n${n}` : n;
}
//#endregion
//#region src/components/ai-table/AIFieldPanel.tsx
function Zn() {
	let { t: e } = Y(), { config: t, draftFields: r, state: i, filteredRows: a, createAIField: o, removeAIField: s, regenerateAIFieldValues: c, saveView: d, setActivePanel: f } = Z(), [p, h] = n.useState(() => lt("aiField")), [g, _] = n.useState(""), [v, y] = n.useState("tag"), [b, x] = n.useState(""), [S, C] = n.useState(!1), [w, T] = n.useState(!1), [E, D] = n.useState([]), [O, k] = n.useState(null), [A, j] = n.useState(!1), [M, N] = n.useState(!1), [P, F] = n.useState(!1), ee = n.useRef(null), te = r.filter((e) => e.aiReadable && e.fieldId !== p), ne = {
		fieldId: p,
		name: g,
		outputType: v,
		prompt: b,
		referencedFieldIds: n.useMemo(() => tr(b), [b]),
		autoUpdate: S,
		allowEmptyReferencedValues: w
	}, L = !!(g.trim() && b.trim() && a.length), z = L || i.dirty;
	async function ie() {
		if (!L || A) return;
		let n = a.slice(0, 5);
		j(!0), k(null), D(n.map((e, n) => ({
			rowKey: t.rowKey(e),
			status: n === 0 ? "running" : "waiting"
		})));
		try {
			let e = n.filter((e) => Ft(ne, e, r)), i = e.length ? await t.aiAdapter.previewAIField({
				definition: ne,
				rows: e,
				rowKey: t.rowKey,
				fields: r
			}) : [], a = new Map(i.map((e) => [e.rowKey, e]));
			D(n.map((e) => {
				let n = t.rowKey(e);
				if (!Ft(ne, e, r)) return {
					rowKey: n,
					status: "skipped"
				};
				let i = a.get(n);
				return {
					rowKey: n,
					status: i?.error ? "error" : "success",
					value: i?.value,
					error: i?.error
				};
			}));
		} catch (r) {
			let i = r instanceof Error ? r.message : e("aiTable.aiField.generateFailed");
			k(i), D(n.map((e) => ({
				rowKey: t.rowKey(e),
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
				L ? (await o(ne), oe()) : d();
			} catch (t) {
				k(t instanceof Error ? t.message : e("aiTable.aiField.generateFailed"));
			} finally {
				N(!1);
			}
		}
	}
	function ae(e) {
		let t = te.find((t) => t.fieldId === e);
		t && ee.current?.insertField({
			fieldId: t.fieldId,
			label: t.label
		}), F(!1);
	}
	function oe() {
		h(lt("aiField")), _(""), y("tag"), x(""), C(!1), T(!1), D([]);
	}
	return /* @__PURE__ */ u("div", {
		className: "flex h-full min-h-0 flex-col bg-popover",
		children: [
			/* @__PURE__ */ u("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ u("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ l(m, { className: "size-4 text-primary" }), e("aiTable.aiField.title")]
				}), /* @__PURE__ */ l($, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "size-8",
					"aria-label": e("aiTable.aiField.close"),
					onClick: () => f(null),
					children: /* @__PURE__ */ l(de, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ u("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-4",
				children: [
					O ? /* @__PURE__ */ l("p", {
						role: "alert",
						className: "text-sm text-status-rejected",
						children: O
					}) : null,
					i.draftView.aiFields.length ? /* @__PURE__ */ u("div", {
						className: "rounded-lg border bg-muted/20 p-3",
						children: [/* @__PURE__ */ l("p", {
							className: "mb-2 text-xs font-medium text-description",
							children: e("aiTable.aiField.createdFields")
						}), /* @__PURE__ */ l("div", {
							className: "space-y-1.5",
							children: i.draftView.aiFields.map((t) => /* @__PURE__ */ u("div", {
								className: "flex items-center justify-between rounded-md bg-card px-2 py-1.5",
								children: [/* @__PURE__ */ u("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ l(Bn, {
										variant: "blue",
										children: er(t.outputType)
									}), /* @__PURE__ */ l("span", {
										className: "text-xs font-medium",
										children: t.name
									})]
								}), /* @__PURE__ */ u("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ l($, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "size-7 text-muted-foreground",
										"aria-label": e("aiTable.aiField.rerun", { name: t.name }),
										onClick: () => void c(t.fieldId).catch((t) => k(t instanceof Error ? t.message : e("aiTable.aiField.generateFailed"))),
										children: /* @__PURE__ */ l(re, { className: "size-3.5" })
									}), /* @__PURE__ */ l($, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "size-7 text-muted-foreground",
										"aria-label": e("aiTable.aiField.delete", { name: t.name }),
										onClick: () => s(t.fieldId),
										children: /* @__PURE__ */ l(ce, { className: "size-3.5" })
									})]
								})]
							}, t.fieldId))
						})]
					}) : null,
					/* @__PURE__ */ u("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ u("label", {
							className: "text-xs font-medium",
							children: [
								e("aiTable.aiField.fieldName"),
								" ",
								/* @__PURE__ */ l("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ l(Dn, {
							value: g,
							maxLength: 50,
							onChange: (e) => _(e.target.value),
							placeholder: e("aiTable.aiField.fieldNamePlaceholder")
						})]
					}),
					/* @__PURE__ */ u("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ u("label", {
							className: "text-xs font-medium",
							children: [
								e("aiTable.aiField.outputType"),
								" ",
								/* @__PURE__ */ l("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ u(gn, {
							value: v,
							onValueChange: (e) => y(e),
							children: [/* @__PURE__ */ l(yn, { children: /* @__PURE__ */ l(vn, {}) }), /* @__PURE__ */ u(bn, { children: [
								/* @__PURE__ */ l(xn, {
									value: "text",
									children: e("aiTable.aiField.outputText")
								}),
								/* @__PURE__ */ l(xn, {
									value: "number",
									children: e("aiTable.aiField.outputNumber")
								}),
								/* @__PURE__ */ l(xn, {
									value: "tag",
									children: e("aiTable.aiField.outputTag")
								})
							] })]
						})]
					}),
					/* @__PURE__ */ u("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ u("label", {
							className: "text-xs font-medium",
							children: [
								e("aiTable.aiField.prompt"),
								" ",
								/* @__PURE__ */ l("span", {
									className: "text-status-rejected",
									children: "*"
								})
							]
						}), /* @__PURE__ */ u("div", {
							className: "rounded-lg border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
							children: [/* @__PURE__ */ l(qn, {
								ref: ee,
								value: b,
								fields: te,
								onChange: x,
								placeholder: e("aiTable.aiField.promptPlaceholder")
							}), /* @__PURE__ */ l("div", {
								className: "flex flex-wrap items-center gap-1.5 border-t px-2 py-2",
								children: /* @__PURE__ */ u(pn, {
									open: P,
									onOpenChange: F,
									children: [/* @__PURE__ */ l(mn, {
										asChild: !0,
										children: /* @__PURE__ */ u($, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "ml-auto h-7 gap-1 text-xs",
											children: [/* @__PURE__ */ l(R, { className: "size-3.5" }), e("aiTable.aiField.insertField")]
										})
									}), /* @__PURE__ */ l(hn, {
										align: "end",
										className: "w-56 p-1",
										children: te.map((t) => /* @__PURE__ */ u("button", {
											type: "button",
											className: "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs hover:bg-muted",
											onClick: () => ae(t.fieldId),
											children: [/* @__PURE__ */ l("span", { children: t.label }), /* @__PURE__ */ l("span", {
												className: "text-[10px] text-muted-foreground",
												children: t.source === "derived" ? e("aiTable.aiField.sourceDerived") : t.source === "ai" ? e("aiTable.aiField.sourceAi") : e("aiTable.aiField.sourceBusiness")
											})]
										}, t.fieldId))
									})]
								})
							})]
						})]
					}),
					/* @__PURE__ */ u("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ l("p", {
							className: "text-xs font-medium",
							children: e("aiTable.aiField.generationSettings")
						}), /* @__PURE__ */ l(Hn, { children: /* @__PURE__ */ u("div", {
							className: "space-y-3 rounded-lg border bg-card px-3 py-3",
							children: [/* @__PURE__ */ l($n, {
								id: "ai-field-auto-update",
								label: e("aiTable.aiField.autoUpdate"),
								tooltip: e("aiTable.aiField.autoUpdateTooltip"),
								checked: S,
								onCheckedChange: C
							}), /* @__PURE__ */ l($n, {
								id: "ai-field-allow-empty-references",
								label: e("aiTable.aiField.allowEmptyReferences"),
								tooltip: e("aiTable.aiField.allowEmptyReferencesTooltip"),
								checked: w,
								onCheckedChange: T
							})]
						}) })]
					}),
					/* @__PURE__ */ u("div", { children: [/* @__PURE__ */ u("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ l("p", {
							className: "text-xs font-medium",
							children: e("aiTable.aiField.preview")
						}), E.length ? /* @__PURE__ */ u($, {
							type: "button",
							variant: "ghost",
							size: "sm",
							className: "h-7 gap-1 text-xs",
							disabled: A,
							onClick: () => void ie(),
							children: [/* @__PURE__ */ l(re, { className: "size-3.5" }), e("aiTable.aiField.repreview")]
						}) : null]
					}), /* @__PURE__ */ u("div", {
						className: "overflow-hidden rounded-lg border",
						children: [
							/* @__PURE__ */ u("div", {
								className: "grid grid-cols-[1.2fr_1fr] bg-muted/40 px-3 py-2 text-[11px] font-medium text-description",
								children: [/* @__PURE__ */ l("span", { children: e("aiTable.aiField.record") }), /* @__PURE__ */ l("span", { children: e("aiTable.aiField.previewColumn", { name: g || e("aiTable.aiField.title") }) })]
							}),
							(E.length ? E : a.slice(0, 5).map((e) => ({
								rowKey: t.rowKey(e),
								status: "waiting"
							}))).map((e) => /* @__PURE__ */ u("div", {
								className: "grid grid-cols-[1.2fr_1fr] border-t px-3 py-2 text-xs",
								children: [/* @__PURE__ */ l("span", {
									className: "truncate font-mono text-description",
									children: e.rowKey
								}), /* @__PURE__ */ l(Qn, { row: e })]
							}, e.rowKey)),
							a.length ? null : /* @__PURE__ */ l("p", {
								className: "px-3 py-4 text-center text-xs text-muted-foreground",
								children: e("aiTable.aiField.noRecords")
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ u("div", {
				className: "flex items-center justify-end gap-2 border-t px-4 py-3",
				children: [
					/* @__PURE__ */ l($, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => f(null),
						children: e("aiTable.aiField.cancel")
					}),
					/* @__PURE__ */ u($, {
						type: "button",
						variant: "outline",
						size: "sm",
						disabled: !L || A,
						onClick: () => void ie(),
						children: [A ? /* @__PURE__ */ l(I, { className: "size-4 animate-spin" }) : null, e("aiTable.aiField.runPreview")]
					}),
					/* @__PURE__ */ u($, {
						type: "button",
						size: "sm",
						disabled: !z || M,
						onClick: () => void B(),
						children: [M ? /* @__PURE__ */ l(I, { className: "size-4 animate-spin" }) : null, e("aiTable.aiField.save")]
					})
				]
			})
		]
	});
}
function Qn({ row: e }) {
	let { t } = Y();
	return e.status === "running" ? /* @__PURE__ */ u("span", {
		className: "flex items-center gap-1 text-primary",
		children: [/* @__PURE__ */ l(I, { className: "size-3.5 animate-spin" }), t("aiTable.aiField.generating")]
	}) : e.status === "success" ? /* @__PURE__ */ u("span", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ l(_, { className: "size-3.5 text-status-approved" }), String(e.value ?? "—")]
	}) : e.status === "error" ? /* @__PURE__ */ l("span", {
		className: "text-status-rejected",
		children: e.error ?? t("aiTable.aiField.generateFailed")
	}) : e.status === "skipped" ? /* @__PURE__ */ l("span", {
		className: "text-muted-foreground",
		children: t("aiTable.aiField.skipped")
	}) : /* @__PURE__ */ l("span", {
		className: "text-muted-foreground",
		children: t("aiTable.aiField.waiting")
	});
}
function $n({ id: e, label: t, tooltip: n, checked: r, onCheckedChange: i }) {
	let { t: a } = Y();
	return /* @__PURE__ */ u("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ l(Vn, {
				id: e,
				checked: r,
				onCheckedChange: (e) => i(e === !0)
			}),
			/* @__PURE__ */ l("label", {
				htmlFor: e,
				className: "cursor-pointer text-sm font-medium",
				children: t
			}),
			/* @__PURE__ */ u(Un, { children: [/* @__PURE__ */ l(Wn, {
				asChild: !0,
				children: /* @__PURE__ */ l("button", {
					type: "button",
					className: "text-muted-foreground transition-colors hover:text-foreground",
					"aria-label": `${t}${a("aiTable.aiField.tooltipSuffix")}`,
					children: /* @__PURE__ */ l(P, { className: "size-4" })
				})
			}), /* @__PURE__ */ l(Gn, {
				side: "top",
				sideOffset: 6,
				className: "max-w-64 text-xs leading-5",
				children: n
			})] })
		]
	});
}
function er(e) {
	return e === "tag" ? J.t("aiTable.aiField.outputTag") : e === "number" ? J.t("aiTable.aiField.outputNumber") : J.t("aiTable.aiField.outputText");
}
function tr(e) {
	return [...new Set(Array.from(e.matchAll(/\{\{([^}]+)\}\}/g), (e) => e[1]))];
}
//#endregion
//#region src/components/ai-table/AITableConditionBuilder.tsx
function nr({ fields: e, value: t, onChange: n }) {
	let { t: r } = Y(), i = e.filter((e) => e.filterable);
	function a(e = "and") {
		let r = i.find((e) => e.type === "tag") ?? i[0];
		r && n([...t, {
			id: lt("filter"),
			fieldId: r.fieldId,
			operator: He(r.type)[0].value,
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
	return /* @__PURE__ */ u("div", { children: [
		/* @__PURE__ */ l("p", {
			className: "mb-3 text-xs text-muted-foreground",
			children: r("aiTable.filter.conditionDescription")
		}),
		/* @__PURE__ */ l("div", {
			className: "space-y-2",
			children: t.map((a, s) => {
				let c = e.find((e) => e.fieldId === a.fieldId), d = c ? He(c.type) : [];
				return /* @__PURE__ */ u("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ l(M, { className: "size-4 shrink-0 text-muted-foreground/60" }),
						s === 0 ? /* @__PURE__ */ l("span", {
							className: "w-12 shrink-0 text-sm font-medium",
							children: r("aiTable.filter.when")
						}) : /* @__PURE__ */ u(gn, {
							value: a.conjunction,
							onValueChange: (e) => o(a.id, { conjunction: e }),
							children: [/* @__PURE__ */ l(yn, {
								className: "w-[68px] shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ l(vn, { children: a.conjunction === "and" ? r("aiTable.filter.and") : r("aiTable.filter.or") })
							}), /* @__PURE__ */ u(bn, { children: [/* @__PURE__ */ l(xn, {
								value: "and",
								children: r("aiTable.filter.and")
							}), /* @__PURE__ */ l(xn, {
								value: "or",
								children: r("aiTable.filter.or")
							})] })]
						}),
						/* @__PURE__ */ u(gn, {
							value: a.fieldId,
							onValueChange: (t) => {
								let n = e.find((e) => e.fieldId === t);
								o(a.id, {
									fieldId: t,
									operator: He(n?.type ?? "text")[0].value,
									value: ""
								});
							},
							children: [/* @__PURE__ */ l(yn, {
								className: "w-36 shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ l(vn, {})
							}), /* @__PURE__ */ l(bn, { children: i.map((e) => /* @__PURE__ */ l(En, {
								fieldId: e.fieldId,
								label: e.label,
								type: e.type
							}, e.fieldId)) })]
						}),
						/* @__PURE__ */ u(gn, {
							value: a.operator,
							onValueChange: (e) => o(a.id, { operator: e }),
							children: [/* @__PURE__ */ l(yn, {
								className: "w-28 shrink-0",
								onPointerDown: () => {
									document.activeElement instanceof HTMLElement && document.activeElement.blur();
								},
								children: /* @__PURE__ */ l(vn, {})
							}), /* @__PURE__ */ l(bn, { children: d.map((e) => /* @__PURE__ */ l(xn, {
								value: e.value,
								children: e.label
							}, e.value)) })]
						}),
						/* @__PURE__ */ l(jn, {
							className: "min-w-0 flex-1",
							field: c,
							operator: a.operator,
							value: a.value,
							onChange: (e) => o(a.id, { value: e })
						}),
						/* @__PURE__ */ l($, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "size-8 shrink-0 text-muted-foreground",
							"aria-label": r("aiTable.filter.deleteCondition", { index: s + 1 }),
							onClick: () => n(t.filter((e) => e.id !== a.id)),
							children: /* @__PURE__ */ l(ce, { className: "size-4" })
						})
					]
				}, a.id);
			})
		}),
		/* @__PURE__ */ u("div", {
			className: "mt-3 flex items-center gap-2",
			children: [/* @__PURE__ */ u($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "gap-1 px-2",
				onClick: () => a("and"),
				children: [/* @__PURE__ */ l(R, { className: "size-4" }), r("aiTable.filter.addCondition")]
			}), /* @__PURE__ */ u($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "gap-1 px-2",
				onClick: () => a("or"),
				children: [/* @__PURE__ */ l(R, { className: "size-4" }), r("aiTable.filter.addConditionGroup")]
			})]
		})
	] });
}
//#endregion
//#region src/components/ai-table/AIFilterPanel.tsx
function rr() {
	let { t: e } = Y(), { config: t, draftFields: r, queryFieldIds: i, state: a, updateDraft: o, setGenerationState: s } = Z(), c = a.draftView.filters, d = r.filter((e) => e.filterable && (!i || i.includes(e.fieldId))), [f, p] = n.useState(""), [m, h] = n.useState(null), g = a.generationState === "generating";
	async function _() {
		if (!(!f.trim() || g)) {
			s("generating"), h(null);
			try {
				let n = await t.aiAdapter.generateFilters({
					instruction: f,
					fields: d
				});
				n.length ? (o({ filters: [...c, ...n] }), h(e("aiTable.filter.generated", { instruction: f }))) : h(e("aiTable.filter.noConditions")), s("success");
			} catch (t) {
				let n = t instanceof Error ? t.message : typeof t == "string" ? t : "";
				h(n || e("aiTable.filter.generateFailed")), s("error");
			}
		}
	}
	return /* @__PURE__ */ u("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ l(On, { title: e("aiTable.filter.title") }),
			/* @__PURE__ */ u("div", {
				className: "space-y-4 p-4",
				children: [
					/* @__PURE__ */ l(kn, {
						value: f,
						onChange: p,
						onSubmit: _,
						loading: g,
						placeholder: e("aiTable.filter.placeholder")
					}),
					g ? /* @__PURE__ */ u("div", {
						className: "flex items-center gap-2 text-xs text-primary",
						children: [/* @__PURE__ */ l(I, { className: "size-3.5 animate-spin" }), e("aiTable.filter.generating", { instruction: f })]
					}) : m ? /* @__PURE__ */ u("div", {
						className: "flex items-center justify-between text-xs text-description",
						children: [/* @__PURE__ */ l("span", { children: m }), /* @__PURE__ */ u("div", {
							className: "flex items-center gap-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ l($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": e("aiTable.filter.feedbackHelpful"),
									children: /* @__PURE__ */ l(se, { className: "size-3.5" })
								}),
								/* @__PURE__ */ l($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": e("aiTable.filter.feedbackUnhelpful"),
									children: /* @__PURE__ */ l(V, { className: "size-3.5" })
								}),
								/* @__PURE__ */ l($, {
									type: "button",
									variant: "ghost",
									size: "icon",
									className: "size-7",
									"aria-label": e("aiTable.filter.copyInstruction"),
									children: /* @__PURE__ */ l(A, { className: "size-3.5" })
								})
							]
						})]
					}) : null,
					/* @__PURE__ */ l(nr, {
						fields: d,
						value: c,
						onChange: (e) => o({ filters: e })
					})
				]
			}),
			/* @__PURE__ */ l(An, {})
		]
	});
}
//#endregion
//#region src/components/ai-table/AIGroupingPanel.tsx
var ir = 2;
function ar() {
	let { t: e } = Y(), { draftFields: t, rows: r, state: i, updateDraft: a } = Z(), o = i.draftView.groups, s = t.filter((e) => e.groupable), [c, d] = n.useState(null);
	function f() {
		if (o.length >= ir) return;
		let e = new Set(o.map((e) => e.fieldId)), t = s.find((t) => !e.has(t.fieldId) && t.source === "ai") ?? s.find((t) => !e.has(t.fieldId) && t.type === "tag") ?? s.find((t) => !e.has(t.fieldId));
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
		if (c == null || c === e) return;
		let t = [...o], [n] = t.splice(c, 1);
		t.splice(e, 0, n), a({ groups: t }), d(e);
	}
	function h() {
		let e = nt($e(r, i.savedView.filters, t), o, t, []);
		a({ collapsedGroupKeys: or(e) });
	}
	return /* @__PURE__ */ u("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ l(On, {
				title: e("aiTable.group.title"),
				actions: o.length ? /* @__PURE__ */ u("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ l($, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "h-7 text-xs",
						onClick: h,
						children: e("aiTable.group.collapseAll")
					}), /* @__PURE__ */ l($, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "h-7 text-xs",
						onClick: () => a({ collapsedGroupKeys: [] }),
						children: e("aiTable.group.expandAll")
					})]
				}) : null
			}),
			/* @__PURE__ */ u("div", {
				className: "space-y-2 p-4",
				children: [
					o.map((t, n) => /* @__PURE__ */ u("div", {
						draggable: !0,
						onDragStart: () => d(n),
						onDragOver: (e) => {
							e.preventDefault(), m(n);
						},
						onDragEnd: () => d(null),
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ l(M, { className: "size-4 cursor-grab text-muted-foreground" }),
							/* @__PURE__ */ u(gn, {
								value: t.fieldId,
								onValueChange: (e) => p(n, { fieldId: e }),
								children: [/* @__PURE__ */ l(yn, {
									className: "flex-1",
									children: /* @__PURE__ */ l(vn, {})
								}), /* @__PURE__ */ l(bn, { children: s.map((e) => /* @__PURE__ */ l(En, {
									fieldId: e.fieldId,
									label: e.label,
									type: e.type
								}, e.fieldId)) })]
							}),
							/* @__PURE__ */ u("div", {
								className: "flex rounded-md bg-muted p-0.5",
								children: [/* @__PURE__ */ l($, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: t.direction === "asc" ? "h-8 bg-card px-3 text-xs text-primary shadow-sm" : "h-8 px-3 text-xs text-muted-foreground",
									onClick: () => p(n, { direction: "asc" }),
									children: e("aiTable.group.optionOrder")
								}), /* @__PURE__ */ l($, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: t.direction === "desc" ? "h-8 bg-card px-3 text-xs text-primary shadow-sm" : "h-8 px-3 text-xs text-muted-foreground",
									onClick: () => p(n, { direction: "desc" }),
									children: e("aiTable.group.optionReverse")
								})]
							}),
							/* @__PURE__ */ l($, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "size-8 text-muted-foreground",
								"aria-label": e("aiTable.group.deleteGroup", { index: n + 1 }),
								onClick: () => a({ groups: o.filter((e, t) => t !== n) }),
								children: /* @__PURE__ */ l(ce, { className: "size-4" })
							})
						]
					}, `${t.fieldId}-${n}`)),
					o.length < ir ? /* @__PURE__ */ u($, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2 gap-1",
						onClick: f,
						children: [/* @__PURE__ */ l(R, { className: "size-4" }), e("aiTable.group.addGroup")]
					}) : null,
					o.length ? null : /* @__PURE__ */ l("p", {
						className: "py-4 text-center text-xs text-muted-foreground",
						children: e("aiTable.group.emptyHint")
					})
				]
			}),
			/* @__PURE__ */ l(An, { primaryLabel: e("aiTable.group.apply") })
		]
	});
}
function or(e) {
	return e.flatMap((e) => [e.key, ...e.children ? or(e.children) : []]);
}
//#endregion
//#region src/components/ai-table/AISortingPanel.tsx
function sr() {
	let { t: e } = Y(), { draftFields: t, queryFieldIds: r, state: i, updateDraft: a } = Z(), o = i.draftView.sorts, s = t.filter((e) => e.sortable && (!r || r.includes(e.fieldId))), [c, d] = n.useState(null);
	function f() {
		let e = new Set(o.map((e) => e.fieldId)), t = s.find((t) => !e.has(t.fieldId));
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
		if (c == null || c === e) return;
		let t = [...o], [n] = t.splice(c, 1);
		t.splice(e, 0, n), a({ sorts: t }), d(e);
	}
	let h = new Set(o.map((e) => e.fieldId)), g = s.some((e) => !h.has(e.fieldId));
	return /* @__PURE__ */ u("div", {
		className: "bg-popover",
		children: [
			/* @__PURE__ */ l(On, { title: e("aiTable.sort.title") }),
			/* @__PURE__ */ u("div", {
				className: "space-y-2 p-4",
				children: [
					o.map((t, n) => /* @__PURE__ */ u("div", {
						className: "flex items-center gap-2",
						onDragOver: (e) => {
							e.preventDefault(), m(n);
						},
						children: [
							/* @__PURE__ */ l("button", {
								type: "button",
								draggable: !0,
								className: "flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing",
								"aria-label": e("aiTable.sort.dragHint", { index: n + 1 }),
								onDragStart: () => d(n),
								onDragEnd: () => d(null),
								children: /* @__PURE__ */ l(M, { className: "size-4" })
							}),
							/* @__PURE__ */ u(gn, {
								value: t.fieldId,
								onValueChange: (e) => p(n, { fieldId: e }),
								children: [/* @__PURE__ */ l(yn, {
									className: "min-w-0 flex-1",
									children: /* @__PURE__ */ l(vn, {})
								}), /* @__PURE__ */ l(bn, { children: s.map((e) => /* @__PURE__ */ l(En, {
									fieldId: e.fieldId,
									label: e.label,
									type: e.type,
									disabled: e.fieldId !== t.fieldId && h.has(e.fieldId)
								}, e.fieldId)) })]
							}),
							/* @__PURE__ */ u("div", {
								className: "flex shrink-0 rounded-lg bg-muted p-1",
								children: [/* @__PURE__ */ l(cr, {
									active: t.direction === "asc",
									label: "A → Z",
									ariaLabel: e("aiTable.sort.asc", { index: n + 1 }),
									onClick: () => p(n, { direction: "asc" })
								}), /* @__PURE__ */ l(cr, {
									active: t.direction === "desc",
									label: "Z → A",
									ariaLabel: e("aiTable.sort.desc", { index: n + 1 }),
									onClick: () => p(n, { direction: "desc" })
								})]
							}),
							/* @__PURE__ */ l($, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "size-8 shrink-0 text-muted-foreground",
								"aria-label": e("aiTable.sort.deleteSort", { index: n + 1 }),
								onClick: () => a({ sorts: o.filter((e, t) => t !== n) }),
								children: /* @__PURE__ */ l(ce, { className: "size-4" })
							})
						]
					}, `${t.fieldId}-${n}`)),
					g ? /* @__PURE__ */ u($, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2 gap-1",
						onClick: f,
						children: [/* @__PURE__ */ l(R, { className: "size-4" }), e("aiTable.sort.addSort")]
					}) : null,
					o.length ? null : /* @__PURE__ */ l("p", {
						className: "py-4 text-center text-xs text-muted-foreground",
						children: e("aiTable.sort.emptyHint")
					})
				]
			}),
			/* @__PURE__ */ l(An, { primaryLabel: e("aiTable.sort.apply") })
		]
	});
}
function cr({ active: e, label: t, ariaLabel: n, onClick: r }) {
	return /* @__PURE__ */ l($, {
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
function lr() {
	let { t: e } = Y(), { state: t, setActivePanel: n, appliedFields: r, restoreDefaultView: i } = Z(), { savedView: a } = t, o = r.find((e) => e.fieldId === a.groups[0]?.fieldId), s = [
		{
			panel: "filter",
			icon: /* @__PURE__ */ l(j, { className: "size-4" }),
			label: e("aiTable.toolbar.filter"),
			summary: ut(a.filters),
			content: /* @__PURE__ */ l(rr, {}),
			width: "w-[590px]"
		},
		{
			panel: "group",
			icon: /* @__PURE__ */ l(F, { className: "size-4" }),
			label: e("aiTable.toolbar.group"),
			summary: o ? e("aiTable.toolbar.groupSummaryByField", { field: o.label }) : null,
			content: /* @__PURE__ */ l(ar, {}),
			width: "w-[520px]"
		},
		{
			panel: "sort",
			icon: /* @__PURE__ */ l(p, { className: "size-4" }),
			label: e("aiTable.toolbar.sort"),
			summary: ft(a.sorts, r),
			content: /* @__PURE__ */ l(sr, {}),
			width: "w-[620px]"
		},
		{
			panel: "color",
			icon: /* @__PURE__ */ l(ne, { className: "size-4" }),
			label: e("aiTable.toolbar.color"),
			summary: gt(a.colorRules),
			content: /* @__PURE__ */ l(Rn, {}),
			width: "w-[700px]"
		},
		{
			panel: "aiField",
			icon: /* @__PURE__ */ l(R, { className: "size-4" }),
			label: e("aiTable.toolbar.addField"),
			content: /* @__PURE__ */ l(Zn, {}),
			width: "w-[540px]"
		}
	];
	return /* @__PURE__ */ u("div", {
		className: "flex min-w-0 items-center gap-1",
		children: [
			/* @__PURE__ */ u("div", {
				className: "mr-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-description",
				children: [/* @__PURE__ */ l(B, { className: "size-4 text-primary" }), e("aiTable.toolbar.savedView")]
			}),
			s.map((e) => /* @__PURE__ */ l(ur, {
				...e,
				activePanel: t.activePanel,
				setActivePanel: n
			}, e.panel)),
			/* @__PURE__ */ u($, {
				type: "button",
				"aria-label": e("aiTable.toolbar.restoreDefault", "恢复默认视图"),
				title: e("aiTable.toolbar.restoreDefault", "恢复默认视图"),
				variant: "ghost",
				size: "sm",
				className: "h-8 gap-1.5 whitespace-nowrap px-3 text-xs text-description",
				onClick: i,
				children: [/* @__PURE__ */ l(z, { className: "size-4" }), e("aiTable.toolbar.restoreDefault", "恢复默认视图")]
			})
		]
	});
}
function ur({ panel: e, icon: t, label: n, summary: r, content: i, width: a, activePanel: o, setActivePanel: s }) {
	let c = o === e;
	return /* @__PURE__ */ u(pn, {
		open: c,
		onOpenChange: (t) => s(t ? e : null),
		children: [/* @__PURE__ */ l(mn, {
			asChild: !0,
			children: /* @__PURE__ */ u($, {
				type: "button",
				"aria-label": n,
				variant: "ghost",
				size: "sm",
				className: Q("h-8 gap-1.5 whitespace-nowrap border border-transparent px-3 text-xs text-description", (c || r) && "border-primary/20 bg-primary/6 text-foreground"),
				children: [
					/* @__PURE__ */ l("span", {
						className: Q(c && "text-primary"),
						children: t
					}),
					r ?? n,
					e === "filter" && r ? /* @__PURE__ */ l("span", {
						className: "flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground",
						children: Math.max(1, Number(r.match(/\d+/)?.[0] ?? 1))
					}) : null
				]
			})
		}), /* @__PURE__ */ l(hn, {
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
var dr = {
	filter: "aiTable.draftBar.filter",
	group: "aiTable.draftBar.group",
	sort: "aiTable.draftBar.sort",
	color: "aiTable.draftBar.color",
	aiField: "aiTable.draftBar.aiField"
};
function fr() {
	let { t: e } = Y(), { state: t, saveView: n, cancelDraft: r } = Z();
	return t.dirty ? /* @__PURE__ */ u("div", {
		className: "flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary/6 pl-3 text-xs text-description",
		children: [
			/* @__PURE__ */ l("span", { children: e("aiTable.draftBar.adjustedConfig", { label: t.activePanel ? e(dr[t.activePanel]) : e("aiTable.draftBar.view") }) }),
			/* @__PURE__ */ l($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-8 px-2 text-xs text-primary",
				onClick: r,
				children: e("aiTable.draftBar.cancel")
			}),
			/* @__PURE__ */ l($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-8 px-2 text-xs text-primary",
				onClick: n,
				children: e("aiTable.draftBar.save")
			})
		]
	}) : /* @__PURE__ */ u("div", {
		className: "flex items-center gap-1.5 whitespace-nowrap text-xs text-description",
		children: [/* @__PURE__ */ l(_, { className: "size-4 text-status-approved" }), e("aiTable.draftBar.viewSaved")]
	});
}
//#endregion
//#region src/components/ai-table/AITableFreezeBoundary.tsx
function pr() {
	let { t: e } = Y(), { config: t, state: r, updateDraft: i } = Z(), { draftView: a } = r, o = a.frozenColumnCount, s = n.useMemo(() => t.fields.filter((e) => e.source === "business" || e.source === "derived").length, [t.fields]), c = X(o, s);
	function d() {
		let e = X(c + 1, s);
		i({ frozenColumnCount: e });
	}
	function f() {
		let e = X(c - 1, s);
		i({ frozenColumnCount: e });
	}
	function p() {
		i({ frozenColumnCount: 0 });
	}
	return s === 0 ? null : /* @__PURE__ */ u("div", {
		className: "flex items-center gap-2 border-t bg-card px-4 py-2 lg:px-6",
		children: [
			/* @__PURE__ */ l(L, { className: "size-3.5 text-muted-foreground" }),
			/* @__PURE__ */ l("span", {
				className: "text-xs text-muted-foreground",
				children: e("aiTable.freeze.frozenColumns")
			}),
			/* @__PURE__ */ u("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ l($, {
						type: "button",
						variant: "outline",
						size: "icon",
						className: "size-7",
						disabled: c === 0,
						onClick: f,
						children: /* @__PURE__ */ l(w, { className: "size-3.5" })
					}),
					/* @__PURE__ */ u("span", {
						className: "min-w-[60px] text-center text-xs font-medium tabular-nums",
						children: [
							c,
							" / ",
							s,
							" ",
							e("aiTable.freeze.columnUnit")
						]
					}),
					/* @__PURE__ */ l($, {
						type: "button",
						variant: "outline",
						size: "icon",
						className: "size-7",
						disabled: c >= s - 1,
						onClick: d,
						children: /* @__PURE__ */ l(E, { className: "size-3.5" })
					})
				]
			}),
			c > 0 && /* @__PURE__ */ l($, {
				type: "button",
				variant: "ghost",
				size: "sm",
				className: "h-7 text-xs text-muted-foreground",
				onClick: p,
				children: e("aiTable.freeze.clearFreeze")
			}),
			c === 0 && /* @__PURE__ */ l("span", {
				className: "text-xs text-muted-foreground",
				children: e("aiTable.freeze.hint")
			})
		]
	});
}
//#endregion
//#region src/components/ui/progress.tsx
function mr({ className: e, value: t, ...n }) {
	return /* @__PURE__ */ l(ve.Root, {
		"data-slot": "progress",
		value: t,
		className: Q("relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted", e),
		...n,
		children: /* @__PURE__ */ l(ve.Indicator, {
			"data-slot": "progress-indicator",
			className: "size-full flex-1 bg-primary transition-all",
			style: { transform: `translateX(-${100 - (t || 0)}%)` }
		})
	});
}
//#endregion
//#region src/hooks/useColumnSettings.ts
function hr(e, t = "medium") {
	return {
		order: e.map((e) => e.id),
		visible: e.filter((e) => e.required || e.defaultVisible !== !1).map((e) => e.id),
		density: t
	};
}
function gr(e, t, n = "medium") {
	if (!e || t.length === 0) return hr(t, n);
	let r = t.map((e) => e.id), i = new Set(r), a = t.filter((e) => e.required).map((e) => e.id), o = hr(t, n), s = Array.from(new Set((e.order ?? []).filter((e) => i.has(e))));
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
var _r = "__noop__";
function vr(e) {
	let { storageKey: t, fields: n, defaultDensity: o = "medium" } = e, c = a(() => hr(n, o), [n, o]), [l, u] = s(c);
	return i(() => {
		if (!(typeof window > "u") && !(t === _r || n.length === 0)) try {
			let e = window.localStorage.getItem(t);
			if (!e) {
				u(c);
				return;
			}
			let r = JSON.parse(e);
			u(gr(r, n, o));
		} catch {
			u(c);
		}
	}, [
		t,
		c,
		n,
		o
	]), {
		state: l,
		defaultState: c,
		applyState: r((e) => {
			let r = gr(e, n, o);
			u(r), typeof window < "u" && t !== _r && n.length > 0 && window.localStorage.setItem(t, JSON.stringify(r));
		}, [
			t,
			n,
			o
		]),
		columnVisibility: a(() => {
			let e = {};
			for (let t of n) e[t.id] = l.visible.includes(t.id);
			return e;
		}, [l.visible, n]),
		density: l.density
	};
}
//#endregion
//#region src/components/ui/sheet.tsx
var yr = n.createContext("right");
function br({ direction: e = "right", children: t, ...n }) {
	return Ut(n.open, n.onOpenChange), /* @__PURE__ */ l(yr.Provider, {
		value: e,
		children: /* @__PURE__ */ l(me.Root, {
			"data-slot": "sheet",
			...n,
			children: t
		})
	});
}
function xr({ ...e }) {
	return /* @__PURE__ */ l(me.Portal, {
		"data-slot": "sheet-portal",
		...e
	});
}
function Sr({ className: e, ...t }) {
	return /* @__PURE__ */ l(me.Overlay, {
		"data-slot": "sheet-overlay",
		className: Q("fixed inset-0 z-50 bg-overlay", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0", e),
		...t
	});
}
var Cr = H(Q("group/sheet-content fixed z-50 flex flex-col bg-card shadow-lg transition ease-in-out", "data-[state=open]:animate-in data-[state=open]:duration-500", "data-[state=closed]:animate-out data-[state=closed]:duration-300"), {
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
function wr({ className: e, size: t, direction: r, children: i, ...a }) {
	let o = n.useContext(yr), s = r ?? o;
	return /* @__PURE__ */ l(xr, { children: /* @__PURE__ */ u("div", {
		className: "ai-table-plugin",
		children: [/* @__PURE__ */ l(Sr, {}), /* @__PURE__ */ u(me.Content, {
			"data-slot": "sheet-content",
			className: Q(Cr({
				direction: s,
				size: t
			}), e),
			...a,
			children: [/* @__PURE__ */ u(me.Close, {
				"data-slot": "sheet-close-button",
				className: "absolute top-4 right-4 z-10 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ l(fe, {}), /* @__PURE__ */ l("span", {
					className: "sr-only",
					children: "关闭"
				})]
			}), /* @__PURE__ */ l("div", {
				className: "flex flex-1 flex-col overflow-hidden",
				children: i
			})]
		})]
	}) });
}
function Tr({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "sheet-header",
		className: Q("flex flex-col gap-0.5 p-6 pb-0", e),
		...t
	});
}
function Er({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "sheet-footer",
		className: Q("mt-auto flex flex-col gap-2 p-6 pt-0", e),
		...t
	});
}
function Dr({ className: e, ...t }) {
	return /* @__PURE__ */ l(me.Title, {
		"data-slot": "sheet-title",
		className: Q("text-lg font-semibold text-foreground", e),
		...t
	});
}
//#endregion
//#region src/components/wms/ColumnSettingsDrawer.tsx
var Or = [
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
function kr({ field: e, index: t }) {
	let { t: n } = Y(), { attributes: r, listeners: i, setNodeRef: a, transform: o, transition: s, isDragging: c } = Pe({
		id: e.id,
		disabled: !!e.pinned
	});
	return /* @__PURE__ */ u("div", {
		ref: a,
		className: Q("flex items-center gap-2 px-3 py-1.5", e.pinned ? "cursor-default" : "cursor-grab", c && "opacity-30"),
		style: {
			transform: Ie.Transform.toString(o),
			transition: s
		},
		...r,
		...e.pinned ? {} : i,
		children: [
			e.pinned ? /* @__PURE__ */ l(L, { className: "size-4 shrink-0 text-primary" }) : /* @__PURE__ */ l(M, { className: "size-4 shrink-0 text-muted-foreground" }),
			/* @__PURE__ */ l("span", {
				className: "w-5 text-right text-xs text-muted-foreground",
				children: t + 1
			}),
			/* @__PURE__ */ l("span", {
				className: "flex-1 truncate text-sm text-foreground",
				children: e.label
			}),
			e.pinned && /* @__PURE__ */ l("span", {
				className: "text-xs text-muted-foreground",
				children: n("wms.columnSettings.pinned", "固定")
			})
		]
	});
}
function Ar({ open: e, onOpenChange: t, fields: n, state: r, defaultState: o, onApply: c }) {
	let { t: d } = Y(), [f, p] = s(r), [m, h] = s(null), _ = Me(je(ke, { activationConstraint: { distance: 5 } }));
	i(() => {
		e && (p(r), h(null));
	}, [e, r]);
	let v = a(() => gr(f, n, f.density), [f, n]), y = a(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of n) {
			let n = t.group ?? d("wms.columnSettings.groupOther", "其他"), r = e.get(n) ?? [];
			r.push(t), e.set(n, r);
		}
		return Array.from(e.entries()).map(([e, t]) => ({
			group: e,
			items: t
		}));
	}, [n, d]), b = a(() => new Map(n.map((e) => [e.id, e])), [n]), x = new Set(v.visible), S = v.order.filter((e) => x.has(e));
	function C(e) {
		p(gr(e, n, e.density));
	}
	function w(e, t) {
		C({
			...v,
			visible: t ? [...v.visible, e] : v.visible.filter((t) => t !== e)
		});
	}
	function T(e) {
		h(e.active.id);
	}
	function E(e) {
		let { active: t, over: n } = e;
		if (h(null), !n || t.id === n.id || b.get(t.id)?.pinned || b.get(n.id)?.pinned) return;
		let r = v.order.indexOf(t.id), i = v.order.indexOf(n.id);
		r === -1 || i === -1 || C({
			...v,
			order: q(v.order, r, i)
		});
	}
	function D() {
		p(o);
	}
	function O() {
		c(v), t(!1);
	}
	return /* @__PURE__ */ l(br, {
		open: e,
		onOpenChange: t,
		direction: "right",
		children: /* @__PURE__ */ u(wr, {
			size: "xl",
			className: "flex flex-col gap-0 bg-card p-0",
			children: [
				/* @__PURE__ */ l(Tr, {
					className: "flex-row items-center justify-between border-b border-border px-6 py-4",
					children: /* @__PURE__ */ l(Dr, {
						className: "text-base",
						children: d("wms.columnSettings.title", "列设置")
					})
				}),
				/* @__PURE__ */ u("div", {
					className: "flex shrink-0 items-center gap-3 border-b border-border bg-muted/30 px-6 py-3",
					children: [/* @__PURE__ */ l("span", {
						className: "text-xs text-muted-foreground",
						children: d("wms.columnSettings.rowHeight", "表格行高")
					}), /* @__PURE__ */ l("div", {
						className: "flex items-center gap-0.5",
						children: Or.map((e) => /* @__PURE__ */ l($, {
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
				/* @__PURE__ */ u("div", {
					className: "flex min-h-0 flex-1 overflow-hidden",
					children: [/* @__PURE__ */ l("div", {
						className: "flex-1 overflow-y-auto border-r border-border px-6 py-4",
						children: y.map((e) => {
							let t = e.items.filter((e) => !e.required).map((e) => e.id), n = t.length > 0 && t.every((e) => x.has(e));
							return /* @__PURE__ */ u("section", {
								className: "mb-5 last:mb-0",
								children: [/* @__PURE__ */ u("div", {
									className: "mb-3 flex items-center gap-2",
									children: [
										/* @__PURE__ */ l("span", { className: "inline-block size-2 rounded-full bg-muted-foreground/30" }),
										/* @__PURE__ */ l("span", {
											className: "text-sm font-medium text-foreground",
											children: e.group
										}),
										t.length > 0 && /* @__PURE__ */ l("button", {
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
								}), /* @__PURE__ */ l("div", {
									className: "grid gap-2 lg:grid-cols-2",
									children: e.items.map((e) => {
										let t = x.has(e.id);
										return /* @__PURE__ */ u("label", {
											className: Q("flex items-center gap-2 rounded-md border p-2", t ? "border-primary/30 bg-primary/5" : "border-border bg-background", e.required ? "cursor-default" : "cursor-pointer"),
											children: [
												/* @__PURE__ */ l(Vn, {
													checked: t,
													disabled: e.required,
													onCheckedChange: (t) => w(e.id, !!t)
												}),
												/* @__PURE__ */ l("span", {
													className: "flex-1 truncate text-sm text-foreground",
													children: e.label
												}),
												e.required && /* @__PURE__ */ l("span", {
													className: "text-xs text-muted-foreground",
													children: d("wms.columnSettings.required", "必选")
												})
											]
										}, e.id);
									})
								})]
							}, e.group);
						})
					}), /* @__PURE__ */ u("div", {
						className: "flex w-52 shrink-0 flex-col border-l border-border",
						children: [/* @__PURE__ */ u("div", {
							className: "border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ u("span", {
								className: "text-xs font-medium text-foreground",
								children: [
									d("wms.columnSettings.selected", "已选"),
									" (",
									S.length,
									")"
								]
							}), /* @__PURE__ */ l("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: d("wms.columnSettings.dragHint", "拖拽调整列顺序")
							})]
						}), /* @__PURE__ */ l("div", {
							className: "flex-1 overflow-y-auto py-2",
							children: /* @__PURE__ */ u(K, {
								sensors: _,
								collisionDetection: Ae,
								onDragStart: T,
								onDragEnd: E,
								children: [/* @__PURE__ */ l(Ne, {
									items: S,
									strategy: Fe,
									children: S.map((e, t) => {
										let n = b.get(e);
										return n ? /* @__PURE__ */ l(kr, {
											field: n,
											index: t
										}, e) : null;
									})
								}), /* @__PURE__ */ l(Oe, {
									dropAnimation: null,
									children: m ? /* @__PURE__ */ u("div", {
										className: "flex cursor-grabbing items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 shadow-md",
										children: [
											/* @__PURE__ */ l(M, { className: "size-4 shrink-0 text-muted-foreground" }),
											/* @__PURE__ */ l("span", {
												className: "w-5 text-right text-xs text-muted-foreground",
												children: S.indexOf(m) + 1
											}),
											/* @__PURE__ */ l("span", {
												className: "flex-1 truncate text-sm text-foreground",
												children: b.get(m)?.label
											})
										]
									}) : null
								})]
							})
						})]
					})]
				}),
				/* @__PURE__ */ u(Er, {
					className: "flex-row items-center justify-between gap-2 border-t border-border p-4",
					children: [/* @__PURE__ */ u($, {
						variant: "outline",
						size: "sm",
						onClick: D,
						children: [/* @__PURE__ */ l(z, { className: "size-3.5" }), d("wms.columnSettings.restoreDefault", "恢复默认")]
					}), /* @__PURE__ */ u("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ l($, {
							variant: "outline",
							size: "sm",
							onClick: () => t(!1),
							children: d("wms.columnSettings.cancel", "取消")
						}), /* @__PURE__ */ u($, {
							size: "sm",
							onClick: O,
							children: [/* @__PURE__ */ l(g, { className: "size-3.5" }), d("wms.columnSettings.save", "保存")]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function jr({ ...e }) {
	return /* @__PURE__ */ l(he.Root, {
		"data-slot": "dropdown-menu",
		...e
	});
}
function Mr({ ...e }) {
	return /* @__PURE__ */ l(he.Trigger, {
		"data-slot": "dropdown-menu-trigger",
		...e
	});
}
function Nr({ className: e, align: t = "start", sideOffset: n = 4, portalled: r = !0, ...i }) {
	let a = /* @__PURE__ */ l(he.Content, {
		"data-slot": "dropdown-menu-content",
		sideOffset: n,
		align: t,
		className: Q("z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
		...i
	});
	return r ? /* @__PURE__ */ l(he.Portal, { children: /* @__PURE__ */ l("div", {
		className: "ai-table-plugin",
		children: a
	}) }) : a;
}
function Pr({ className: e, children: t, checked: n, inset: r, ...i }) {
	return /* @__PURE__ */ u(he.CheckboxItem, {
		"data-slot": "dropdown-menu-checkbox-item",
		"data-inset": r,
		className: Q("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		checked: n,
		...i,
		children: [/* @__PURE__ */ l("span", {
			className: "pointer-events-none absolute right-2 flex items-center justify-center",
			"data-slot": "dropdown-menu-checkbox-item-indicator",
			children: /* @__PURE__ */ l(he.ItemIndicator, { children: /* @__PURE__ */ l(v, {}) })
		}), t]
	});
}
//#endregion
//#region src/components/ui/label.tsx
function Fr({ className: e, ...t }) {
	return /* @__PURE__ */ l(ge.Root, {
		"data-slot": "label",
		className: Q("flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
		...t
	});
}
//#endregion
//#region src/components/ui/skeleton.tsx
function Ir({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "skeleton",
		className: Q("animate-pulse rounded-md bg-accent", e),
		...t
	});
}
//#endregion
//#region src/components/ui/table.tsx
function Lr({ className: e, ...t }) {
	return /* @__PURE__ */ l("div", {
		"data-slot": "table-container",
		className: "relative w-full min-w-0 max-w-full overflow-x-auto",
		children: /* @__PURE__ */ l("table", {
			"data-slot": "table",
			className: Q("w-full caption-bottom text-sm", e),
			...t
		})
	});
}
function Rr({ className: e, ...t }) {
	return /* @__PURE__ */ l("thead", {
		"data-slot": "table-header",
		className: Q("[&_tr]:border-b", e),
		...t
	});
}
function zr({ className: e, ...t }) {
	return /* @__PURE__ */ l("tbody", {
		"data-slot": "table-body",
		className: Q("[&_tr:last-child]:border-0", e),
		...t
	});
}
function Br({ className: e, ...t }) {
	return /* @__PURE__ */ l("tr", {
		"data-slot": "table-row",
		className: Q("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50", e),
		...t
	});
}
function Vr({ className: e, ...t }) {
	return /* @__PURE__ */ l("th", {
		"data-slot": "table-head",
		className: Q("h-10 px-2 text-left align-middle text-sm font-medium text-foreground whitespace-nowrap", "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
function Hr({ className: e, ...t }) {
	return /* @__PURE__ */ l("td", {
		"data-slot": "table-cell",
		className: Q("p-2 align-middle whitespace-nowrap", "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/tabs.tsx
function Ur({ className: e, orientation: t = "horizontal", ...n }) {
	return /* @__PURE__ */ l(be.Root, {
		"data-slot": "tabs",
		"data-orientation": t,
		className: Q("group/tabs flex gap-2 data-horizontal:flex-col", e),
		...n
	});
}
var Wr = H("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function Gr({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ l(be.List, {
		"data-slot": "tabs-list",
		"data-variant": t,
		className: Q(Wr({ variant: t }), e),
		...n
	});
}
function Kr({ className: e, ...t }) {
	return /* @__PURE__ */ l(be.Trigger, {
		"data-slot": "tabs-trigger",
		className: Q("relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent", "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", e),
		...t
	});
}
//#endregion
//#region src/components/wms/DataTable.tsx
function qr(e) {
	return [{
		id: "__select__",
		header: ({ table: e }) => /* @__PURE__ */ l(Vn, {
			checked: e.getIsAllPageRowsSelected() ? !0 : e.getIsSomePageRowsSelected() ? "indeterminate" : !1,
			onCheckedChange: (t) => e.toggleAllPageRowsSelected(!!t),
			"aria-label": "全选"
		}),
		cell: ({ row: e }) => /* @__PURE__ */ l(Vn, {
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
var Jr = /* @__PURE__ */ new Set(["__select__", "__index__"]);
function Yr(e) {
	return Jr.has(e);
}
function Xr({ columns: e, data: t, total: r, page: i, pageSize: a, onPageChange: o, serverSorting: s, onServerSortingChange: m, onPageSizeChange: h, pageSizeOptions: g = [
	10,
	20,
	50,
	100
], tabs: _, activeTab: v, onTabChange: y, onRowSelectionChange: C, rowSelection: w, getRowId: E, getRowCanSelect: O, loading: A = !1, onRefresh: j, emptyText: M = "暂无数据", toolbar: N, batchActions: P, columnSettings: F, showColumnControls: ee = !0, fillWidth: I = !1, rowClassName: te, rowStyle: ne, cellClassName: L, cellStyle: R, columnStyle: z, groups: B, onGroupToggle: ae, frozenLeftColumnIds: oe, onFrozenColumnCountChange: V, minFrozenColumnCount: se, scopeNote: ce, belowToolbar: le, viewToolbar: ue, viewStatus: de, onColumnSettingsStateChange: fe }) {
	let { t: H } = Y(), [U, pe] = n.useState([]), [me] = n.useState([]), [he, ge] = n.useState({}), [_e, ve] = n.useState({}), W = w ?? _e, [ye, be] = n.useState(!1), xe = Object.keys(W).length, G = !!F, Se = n.useMemo(() => G ? e.filter((e) => {
		let t = e.id ?? ("accessorKey" in e ? String(e.accessorKey) : void 0), n = e.meta?.sticky === "right";
		return t && !Yr(t) && t !== "actions" && !n;
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
		e,
		G,
		F
	]), K = vr({
		storageKey: F?.storageKey ?? "__noop__",
		fields: G ? Se : []
	});
	n.useEffect(() => {
		fe?.(K.state);
	}, [K.state, fe]);
	let Oe = G ? K.columnVisibility : he, ke = n.useMemo(() => {
		if (!G) return [];
		let t = e.map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""))).filter((e) => Yr(e)), n = e.filter((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === "actions" || e.meta?.sticky === "right").map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")));
		return [
			...t,
			...K.state.order.filter((e) => !Yr(e) && !n.includes(e)),
			...n
		];
	}, [
		G,
		e,
		K.state.order
	]), Ae = n.useMemo(() => ke.length ? ke : e.map((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""))), [e, ke]), je = n.useMemo(() => {
		let t = new Map(e.map((e) => [String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")), e]));
		return Ae.filter((e) => {
			let n = t.get(e), r = n?.meta?.sticky === "right";
			return !!n && !Yr(e) && e !== "actions" && !r && Oe[e] !== !1;
		});
	}, [
		e,
		Ae,
		Oe
	]), Me = oe?.length ?? 0, Ne = Math.max(0, je.length - 1), q = je.slice(0, Math.min(Me, Ne)), Pe = n.useMemo(() => new Set(q), [q]), Fe = n.useMemo(() => {
		let t = /* @__PURE__ */ new Map(), n = 0;
		for (let r of Ae) {
			let i = e.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === r);
			!i || Oe[r] === !1 || (Yr(r) && V ? (t.set(r, n), n += i.size ?? 40) : Pe.has(r) && (t.set(r, n), n += i.size ?? 150));
		}
		return t;
	}, [
		e,
		Ae,
		Oe,
		Pe,
		V
	]), Ie = q.length > 0, Le = Pe, Re = !!B && B.length > 0, ze = n.useMemo(() => {
		if (!Re || !B) return [];
		let e = [];
		function t(n) {
			for (let r of n) if (e.push({
				type: "groupHeader",
				group: r
			}), !r.collapsed) if (r.children && r.children.length > 0) t(r.children);
			else for (let t of r.rows) {
				let n = E ? E(t) : String(e.length);
				e.push({
					type: "dataRow",
					rowId: n,
					data: t
				});
			}
		}
		return t(B), e;
	}, [
		Re,
		B,
		E
	]), J = n.useRef(null), Be = n.useRef(null), Ve = n.useRef(null), He = n.useRef(null), [Ue, We] = n.useState(!1), [Ge, Ke] = n.useState(!1), [qe, Je] = n.useState(!1), Ye = n.useRef(null), Xe = !!Ie || !!V, Ze = Ue || Ge || qe, Qe = n.useMemo(() => {
		if (!V) return null;
		let t = null;
		for (let n of e) {
			let e = String(n.id ?? ("accessorKey" in n ? n.accessorKey : ""));
			Yr(e) && (t = e);
		}
		return t;
	}, [e, V]), $e = q.length ? q[q.length - 1] : Qe, et = n.useMemo(() => {
		let t = 0;
		for (let n of Ae) {
			let r = e.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n);
			!r || Oe[n] === !1 || (Yr(n) && V ? t += r.size ?? 40 : Le.has(n) && (t += r.size ?? 150));
		}
		return t;
	}, [
		e,
		Ae,
		Oe,
		Le,
		V
	]);
	function tt(t) {
		let n = Be.current;
		if (!n) return null;
		let r = n.getBoundingClientRect(), i = t - r.left + n.scrollLeft, a = Array.from(n.querySelectorAll("thead th")), o = a.find((e) => e.dataset.colId === "__select__"), s = a.filter((t) => {
			let n = t.dataset.colId;
			return !n || n === "__select__" || n === "actions" ? !1 : e.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n)?.meta?.sticky !== "right";
		}), c = a.find((t) => {
			let n = t.dataset.colId;
			return n === "actions" || e.find((e) => String(e.id ?? ("accessorKey" in e ? e.accessorKey : "")) === n)?.meta?.sticky === "right";
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
	function nt(e, t) {
		let n = J.current, r = Be.current, i = Ve.current, a = He.current;
		if (!n || !r) return;
		let o = tt(e.clientX), s = r.getBoundingClientRect(), c = n.getBoundingClientRect(), l = e.clientX - s.left, u = Math.min(Math.max(l, o?.minimumX ?? 0), o?.maximumX ?? r.clientWidth);
		if (t && i && (i.style.left = `${u}px`), a) {
			let t = a.offsetWidth || 150, r = u + 14, i = r + t <= n.clientWidth - 8 ? r : Math.max(8, u - t - 14), o = Math.min(Math.max(e.clientY - c.top - 15, 8), Math.max(8, n.clientHeight - 38));
			a.style.left = `${i}px`, a.style.top = `${o}px`;
		}
	}
	function rt(e) {
		if (!V) return;
		e.preventDefault(), e.stopPropagation(), e.currentTarget.setPointerCapture(e.pointerId);
		let t = e.currentTarget, n = e.pointerId;
		We(!0), nt(e.nativeEvent, !0);
		let r = tt(e.clientX);
		Ye.current = r ? {
			count: r.count,
			snapX: r.snapX
		} : {
			count: q.length,
			snapX: et
		};
		let i = document.body.style.cursor, a = document.body.style.userSelect;
		document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
		let o = (e) => {
			let t = tt(e.clientX);
			t && (Ye.current = {
				count: t.count,
				snapX: t.snapX
			}), nt(e, !0);
		}, s = (e) => {
			document.removeEventListener("pointermove", o), document.removeEventListener("pointerup", s), document.removeEventListener("pointercancel", s), document.body.style.cursor = i, document.body.style.userSelect = a, t.hasPointerCapture(n) && t.releasePointerCapture(n), We(!1), Ke(!1);
			let r = tt(e.clientX);
			r && (Ye.current = {
				count: r.count,
				snapX: r.snapX
			});
			let c = Ye.current?.count ?? q.length;
			Ve.current && (Ve.current.style.left = `${Ye.current?.snapX ?? et}px`), Ye.current = null, V(c);
		};
		document.addEventListener("pointermove", o), document.addEventListener("pointerup", s), document.addEventListener("pointercancel", s);
	}
	function it(e) {
		if (!V || ![
			"ArrowLeft",
			"ArrowRight",
			"Home"
		].includes(e.key)) return;
		e.preventDefault();
		let t = q.length;
		e.key === "Home" ? V(0) : V(t + (e.key === "ArrowRight" ? 1 : -1));
	}
	let at = Math.max(1, Math.ceil(r / a)), X = De({
		data: t,
		columns: e,
		getRowId: E,
		state: {
			sorting: s ?? U,
			columnFilters: me,
			columnVisibility: Oe,
			columnOrder: ke,
			rowSelection: W
		},
		manualPagination: !0,
		pageCount: at,
		enableRowSelection: O ? (e) => O(e.original) : !0,
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(W) : e;
			w === void 0 && ve(t), C?.(t);
		},
		onSortingChange: (e) => {
			if (!m) {
				pe(e);
				return;
			}
			m(typeof e == "function" ? e(s ?? []) : e);
		},
		manualSorting: s !== void 0,
		onColumnVisibilityChange: G ? void 0 : ge,
		getCoreRowModel: we(),
		getFilteredRowModel: Te(),
		getSortedRowModel: Ee()
	}), ot = X.getVisibleLeafColumns(), st = Ie ? (() => {
		let e = [];
		for (let t of ot) {
			let n = String(t.id);
			if (!(Le.has(n) || Yr(n) && V)) break;
			e.push(t);
		}
		return e;
	})() : [], ct = st.length, lt = st.reduce((e, t) => e + t.getSize(), 0), ut = ot.length - ct;
	function dt(e) {
		w === void 0 && ve({}), y?.(e);
	}
	let ft = n.useRef({}), pt = n.useRef(void 0);
	if (pt.current === v) for (let e of _ ?? []) e.count !== void 0 && (ft.current[e.value] = e.count);
	pt.current = v;
	let mt = (_ ?? []).map((e) => ({
		...e,
		count: ft.current[e.value] ?? e.count
	}));
	function ht(e, t, n, r = "") {
		let i = !!Ie && Le.has(t) || Yr(t) && !!V, a = Fe.get(t) ?? 0, o = L?.(e, t) ?? "", s = R?.(e, t), c = ne?.(e);
		return {
			cellClass: [
				n ? "sticky right-0 z-10 bg-card shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)] has-[button[data-state=open]]:z-30" : "",
				i ? "sticky z-10 bg-card" : "",
				n || i ? r : "",
				i && t === $e ? "shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]" : "",
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
	let gt = mt.length > 0 ? /* @__PURE__ */ l(Ur, {
		value: v,
		onValueChange: dt,
		children: /* @__PURE__ */ l(Gr, {
			className: "h-8",
			children: mt.map((e) => /* @__PURE__ */ u(Kr, {
				value: e.value,
				className: "gap-1.5 px-3 text-xs",
				children: [e.label, e.count !== void 0 && /* @__PURE__ */ l(Bn, {
					variant: "secondary",
					className: "h-4 rounded-full px-1 text-[10px] font-medium",
					children: e.count
				})]
			}, e.value))
		})
	}) : null, _t = P ? /* @__PURE__ */ l("div", {
		className: "flex items-center gap-2",
		children: P
	}) : null, vt = xe > 0 ? /* @__PURE__ */ l("span", {
		className: "whitespace-nowrap text-sm text-muted-foreground",
		children: H("wms.selectedCount", { count: xe })
	}) : null, yt = j ? /* @__PURE__ */ l($, {
		type: "button",
		variant: "ghost",
		size: "icon",
		className: "size-8 text-muted-foreground",
		"aria-label": H("common.refresh", "刷新"),
		title: H("common.refresh", "刷新"),
		disabled: A,
		onClick: () => void j(),
		children: /* @__PURE__ */ l(re, { className: `size-4${A ? " animate-spin" : ""}` })
	}) : null, bt = ee ? G ? /* @__PURE__ */ u($, {
		variant: "outline",
		size: "sm",
		onClick: () => be(!0),
		children: [/* @__PURE__ */ l(ie, { className: "size-4" }), H("wms.columnSettings.title", "列设置")]
	}) : /* @__PURE__ */ u(jr, { children: [/* @__PURE__ */ l(Mr, {
		asChild: !0,
		children: /* @__PURE__ */ u($, {
			variant: "outline",
			size: "sm",
			children: [
				/* @__PURE__ */ l(k, { className: "size-4" }),
				H("wms.column", "列"),
				/* @__PURE__ */ l(b, { className: "size-3.5 opacity-60" })
			]
		})
	}), /* @__PURE__ */ l(Nr, {
		align: "end",
		className: "min-w-36",
		children: X.getAllColumns().filter((e) => e.getCanHide()).map((e) => /* @__PURE__ */ l(Pr, {
			checked: e.getIsVisible(),
			onCheckedChange: (t) => e.toggleVisibility(!!t),
			children: typeof e.columnDef.header == "string" ? e.columnDef.header : e.id
		}, e.id))
	})] }) : null, xt = /* @__PURE__ */ u(c, { children: [
		yt,
		N,
		bt
	] }), St = !!(vt || gt || _t || yt || N || bt);
	return /* @__PURE__ */ u("div", {
		className: "flex w-full flex-col gap-0",
		children: [
			ue ? /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ u("div", {
				role: "toolbar",
				"aria-label": "智能表格视图操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto px-4 py-2.5 lg:px-6",
				children: [/* @__PURE__ */ l("div", {
					className: "flex min-w-max items-center gap-2",
					children: typeof ue == "function" ? ue({ openColumnSettings: () => be(!0) }) : ue
				}), de ? /* @__PURE__ */ l("div", {
					className: "flex min-w-max items-center gap-2",
					children: de
				}) : null]
			}), St ? /* @__PURE__ */ u("div", {
				role: "toolbar",
				"aria-label": "业务数据操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto border-t bg-muted/10 px-4 py-2.5 lg:px-6",
				children: [/* @__PURE__ */ u("div", {
					className: "flex min-w-max items-center gap-3",
					children: [
						vt,
						gt,
						_t
					]
				}), /* @__PURE__ */ l("div", {
					className: "flex min-w-max items-center gap-2",
					children: xt
				})]
			}) : null] }) : /* @__PURE__ */ u("div", {
				role: "toolbar",
				"aria-label": "业务数据操作",
				className: "flex items-center justify-between gap-4 overflow-x-auto px-4 py-3 lg:px-6",
				children: [/* @__PURE__ */ u("div", {
					className: "flex min-w-max items-center gap-3",
					children: [
						vt,
						gt,
						_t
					]
				}), /* @__PURE__ */ l("div", {
					className: "flex min-w-max items-center gap-2",
					children: xt
				})]
			}),
			le && /* @__PURE__ */ l("div", {
				className: "border-t",
				children: le
			}),
			ce && /* @__PURE__ */ l("div", {
				className: "border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground lg:px-6",
				children: ce
			}),
			/* @__PURE__ */ u("div", {
				ref: J,
				className: "relative border-t",
				children: [!A && Xe ? /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ u("div", {
					ref: Ve,
					role: "separator",
					"aria-label": H("wms.freeze.dragLabel", "拖拽调整左侧冻结列"),
					"aria-orientation": "vertical",
					"aria-valuemin": se ?? 0,
					"aria-valuenow": q.length,
					"aria-describedby": "freeze-column-drag-tooltip",
					tabIndex: 0,
					className: `group absolute inset-y-0 z-30 flex w-3 -translate-x-1/2 cursor-col-resize touch-none items-start justify-center outline-none transition-colors hover:text-primary ${Ze ? "text-primary" : "text-border"}`,
					style: { left: et },
					onPointerDown: rt,
					onPointerEnter: (e) => {
						nt(e.nativeEvent, !1), Ke(!0);
					},
					onPointerMove: (e) => {
						nt(e.nativeEvent, Ue), Ke(!0);
					},
					onPointerLeave: () => {
						Ue || Ke(!1);
					},
					onFocus: () => Je(!0),
					onBlur: () => Je(!1),
					onKeyDown: it,
					children: [/* @__PURE__ */ l("span", { className: "h-full w-px bg-current transition-colors" }), /* @__PURE__ */ l("span", {
						className: `absolute top-8 flex h-7 w-3 items-center justify-center rounded-full bg-primary shadow-sm ring-primary/25 transition-all group-hover:scale-100 group-hover:opacity-100 ${Ze ? "scale-100 opacity-100" : "scale-90 opacity-0"} ${qe ? "ring-4" : ""}`,
						children: /* @__PURE__ */ l("span", { className: "h-3 w-px bg-primary-foreground/90" })
					})]
				}), /* @__PURE__ */ l("div", {
					ref: He,
					id: "freeze-column-drag-tooltip",
					role: "tooltip",
					className: `pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md transition-opacity ${Ge || Ue ? "opacity-100" : "opacity-0"}`,
					style: {
						left: et + 14,
						top: 8
					},
					children: H("wms.freeze.tooltip", "拖拽可调整冻结区域")
				})] }) : null, /* @__PURE__ */ l("div", {
					ref: Be,
					className: `w-full min-w-0 overflow-x-auto${Xe ? " [&>[data-slot=table-container]]:overflow-visible" : ""}`,
					"data-density": G ? K.density : void 0,
					children: A ? /* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l("div", {
						className: "flex items-center gap-2 border-b bg-muted/60 px-2 py-2.5",
						children: Array.from({ length: Math.min(e.length, 6) }).map((e, t) => /* @__PURE__ */ l(Ir, {
							className: "h-3.5",
							style: { width: `${60 + t * 37 % 80}px` }
						}, t))
					}), Array.from({ length: a > 8 ? 8 : a }).map((t, n) => /* @__PURE__ */ l("div", {
						className: `flex items-center gap-2 border-b px-2 py-2 ${n % 2 == 0 ? "bg-muted/20" : ""}`,
						children: Array.from({ length: Math.min(e.length, 6) }).map((e, t) => /* @__PURE__ */ l(Ir, {
							className: "h-3.5",
							style: { width: `${40 + (n * 13 + t * 29) % 80}px` }
						}, t))
					}, n))] }) : /* @__PURE__ */ u(Lr, {
						className: "table-fixed",
						style: {
							minWidth: X.getTotalSize(),
							width: I ? "100%" : X.getTotalSize()
						},
						children: [/* @__PURE__ */ l(Rr, {
							className: "sticky top-0 z-10 bg-muted",
							children: X.getHeaderGroups().map((e) => /* @__PURE__ */ l(Br, { children: e.headers.map((e) => {
								let t = String(e.column.id), n = e.column.columnDef.meta?.sticky === "right", r = !!Ie && Le.has(t) || Yr(t) && !!V, i = Fe.get(t) ?? 0, a = n ? "sticky right-0 z-20 bg-muted shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)]" : r ? `sticky z-20 bg-muted${t === $e ? " shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]" : ""}` : "", o = {
									width: e.getSize(),
									minWidth: e.getSize(),
									maxWidth: e.getSize(),
									...r ? { left: i } : {},
									...z?.(t)
								};
								return /* @__PURE__ */ l(Vr, {
									colSpan: e.colSpan,
									style: o,
									className: a,
									"data-col-id": t,
									"aria-sort": e.column.getIsSorted() === "asc" ? "ascending" : e.column.getIsSorted() === "desc" ? "descending" : "none",
									children: e.isPlaceholder ? null : s !== void 0 && e.column.getCanSort() ? /* @__PURE__ */ u("button", {
										type: "button",
										className: "flex w-full items-center justify-between gap-2 text-left",
										onClick: e.column.getToggleSortingHandler(),
										"aria-label": `按${String(e.column.columnDef.header ?? t)}排序`,
										children: [Ce(e.column.columnDef.header, e.getContext()), e.column.getIsSorted() === "asc" ? /* @__PURE__ */ l(f, {
											className: "size-3.5 shrink-0",
											"aria-hidden": "true"
										}) : e.column.getIsSorted() === "desc" ? /* @__PURE__ */ l(d, {
											className: "size-3.5 shrink-0",
											"aria-hidden": "true"
										}) : /* @__PURE__ */ l(p, {
											className: "size-3.5 shrink-0 opacity-50",
											"aria-hidden": "true"
										})]
									}) : Ce(e.column.columnDef.header, e.getContext())
								}, e.id);
							}) }, e.id))
						}), /* @__PURE__ */ l(zr, { children: Re ? ze.length === 0 ? /* @__PURE__ */ l(Br, { children: /* @__PURE__ */ l(Hr, {
							colSpan: e.length,
							className: "h-24 text-center text-muted-foreground",
							children: M
						}) }) : ze.map((e) => {
							if (e.type === "groupHeader") {
								let n = e.group.rows.filter((e) => !O || O(e)).map((e) => E ? E(e) : String(t.indexOf(e))).filter((e) => e !== "-1"), r = n.filter((e) => !!W[e]).length, i = n.length > 0 && r === n.length || r > 0 && "indeterminate", a = /* @__PURE__ */ u("div", {
									className: "flex min-w-0 items-center gap-1.5",
									style: { paddingLeft: e.group.depth * 16 },
									children: [
										/* @__PURE__ */ l(Vn, {
											checked: i,
											disabled: n.length === 0,
											onCheckedChange: (e) => {
												let t = e === !0;
												X.setRowSelection((e) => {
													let r = { ...e };
													for (let e of n) t ? r[e] = !0 : delete r[e];
													return r;
												});
											},
											"aria-label": H("wms.group.selectRows", {
												label: e.group.label,
												count: n.length
											})
										}),
										/* @__PURE__ */ l("button", {
											type: "button",
											className: "flex size-4 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground",
											"aria-label": `${e.group.collapsed ? "展开" : "折叠"}分组 ${e.group.label}`,
											onClick: () => ae?.(e.group.key),
											children: /* @__PURE__ */ l("svg", {
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
												children: /* @__PURE__ */ l("path", { d: e.group.collapsed ? "m9 18 6-6-6-6" : "m6 9 6 6 6-6" })
											})
										}),
										/* @__PURE__ */ l("span", {
											className: "truncate text-sm font-semibold",
											children: e.group.label
										}),
										/* @__PURE__ */ u("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: [
												"(",
												e.group.count,
												")"
											]
										})
									]
								});
								return /* @__PURE__ */ l(Br, {
									className: "bg-muted/40 hover:bg-muted/40",
									children: ct > 0 ? /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ l(Hr, {
										colSpan: ct,
										className: "sticky left-0 z-20 overflow-hidden bg-muted py-2 font-medium shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]",
										style: {
											width: lt,
											minWidth: lt,
											maxWidth: lt
										},
										children: a
									}), ut > 0 ? /* @__PURE__ */ l(Hr, {
										colSpan: ut,
										className: "bg-muted/40 p-0",
										"aria-hidden": "true"
									}) : null] }) : /* @__PURE__ */ l(Hr, {
										colSpan: ot.length,
										className: "py-2 font-medium",
										children: a
									})
								}, `gh-${e.group.key}`);
							}
							let n = X.getRowModel().rowsById[e.rowId];
							if (!n) return null;
							let r = te?.(n.original);
							return /* @__PURE__ */ l(Br, {
								"data-state": n.getIsSelected() ? "selected" : void 0,
								className: ["bg-card", r].filter(Boolean).join(" "),
								style: ne?.(n.original),
								children: n.getVisibleCells().map((e) => {
									let t = e.getValue(), i = e.column.columnDef.meta?.sticky === "right", { cellClass: a, cellStyle: o } = ht(n.original, String(e.column.id), i, r);
									return /* @__PURE__ */ l(Hr, {
										className: `${a} overflow-hidden text-ellipsis`,
										title: typeof t == "string" || typeof t == "number" ? String(t) : void 0,
										style: {
											...o,
											width: e.column.getSize(),
											minWidth: e.column.getSize(),
											maxWidth: e.column.getSize()
										},
										children: Ce(e.column.columnDef.cell, e.getContext())
									}, e.id);
								})
							}, `gr-${e.rowId}`);
						}) : X.getRowModel().rows.length === 0 ? /* @__PURE__ */ l(Br, { children: /* @__PURE__ */ l(Hr, {
							colSpan: e.length,
							className: "h-24 text-center text-muted-foreground",
							children: M
						}) }) : X.getRowModel().rows.map((e) => {
							let t = te?.(e.original);
							return /* @__PURE__ */ l(Br, {
								"data-state": e.getIsSelected() ? "selected" : void 0,
								className: ["bg-card", t].filter(Boolean).join(" "),
								style: ne?.(e.original),
								children: e.getVisibleCells().map((n) => {
									let r = n.getValue(), i = n.column.columnDef.meta?.sticky === "right", { cellClass: a, cellStyle: o } = ht(e.original, String(n.column.id), i, t);
									return /* @__PURE__ */ l(Hr, {
										className: `${a} overflow-hidden text-ellipsis`,
										title: typeof r == "string" || typeof r == "number" ? String(r) : void 0,
										style: {
											...o,
											width: n.column.getSize(),
											minWidth: n.column.getSize(),
											maxWidth: n.column.getSize()
										},
										children: Ce(n.column.columnDef.cell, n.getContext())
									}, n.id);
								})
							}, e.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ u("div", {
				className: "flex items-center justify-between border-t px-4 py-3 lg:px-6",
				children: [/* @__PURE__ */ l("div", {
					className: "hidden text-xs text-muted-foreground lg:block",
					children: Object.keys(W).length > 0 ? H("wms.pagination.selectedRows", {
						selected: Object.keys(W).length,
						total: r
					}) : H("wms.pagination.totalRecords", { total: r })
				}), /* @__PURE__ */ u("div", {
					className: "flex w-full items-center gap-6 lg:w-auto",
					children: [
						h && /* @__PURE__ */ u("div", {
							className: "hidden items-center gap-2 lg:flex",
							children: [/* @__PURE__ */ l(Fr, {
								htmlFor: "rows-per-page",
								className: "text-xs text-muted-foreground whitespace-nowrap",
								children: H("wms.pagination.rowsPerPage", "每页行数")
							}), /* @__PURE__ */ u(gn, {
								value: String(a),
								onValueChange: (e) => {
									h(Number(e));
								},
								disabled: A,
								children: [/* @__PURE__ */ l(yn, {
									size: "sm",
									className: "w-20",
									id: "rows-per-page",
									children: /* @__PURE__ */ l(vn, {})
								}), /* @__PURE__ */ l(bn, {
									side: "top",
									children: /* @__PURE__ */ l(_n, { children: g.map((e) => /* @__PURE__ */ l(xn, {
										value: String(e),
										children: e
									}, e)) })
								})]
							})]
						}),
						/* @__PURE__ */ l("div", {
							className: "flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap",
							children: H("wms.pagination.pageInfo", {
								page: i,
								total: at
							})
						}),
						/* @__PURE__ */ u("div", {
							className: "ml-auto flex items-center gap-1 lg:ml-0",
							children: [
								/* @__PURE__ */ u($, {
									variant: "outline",
									size: "icon",
									className: "hidden size-7 lg:flex",
									onClick: () => o(1),
									disabled: A || i <= 1,
									children: [/* @__PURE__ */ l("span", {
										className: "sr-only",
										children: H("common.label.firstPage", "首页")
									}), /* @__PURE__ */ l(T, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ u($, {
									variant: "outline",
									size: "icon",
									className: "size-7",
									onClick: () => o(i - 1),
									disabled: A || i <= 1,
									children: [/* @__PURE__ */ l("span", {
										className: "sr-only",
										children: H("common.label.prevPage", "上一页")
									}), /* @__PURE__ */ l(x, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ u($, {
									variant: "outline",
									size: "icon",
									className: "size-7",
									onClick: () => o(i + 1),
									disabled: A || i >= at,
									children: [/* @__PURE__ */ l("span", {
										className: "sr-only",
										children: H("common.label.nextPage", "下一页")
									}), /* @__PURE__ */ l(S, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ u($, {
									variant: "outline",
									size: "icon",
									className: "hidden size-7 lg:flex",
									onClick: () => o(at),
									disabled: A || i >= at,
									children: [/* @__PURE__ */ l("span", {
										className: "sr-only",
										children: H("common.label.lastPage", "末页")
									}), /* @__PURE__ */ l(D, { className: "size-3.5" })]
								})
							]
						})
					]
				})]
			}),
			G && /* @__PURE__ */ l(Ar, {
				open: ye,
				onOpenChange: be,
				fields: Se,
				state: K.state,
				defaultState: K.defaultState,
				onApply: K.applyState
			})
		]
	});
}
//#endregion
//#region src/components/ai-table/AITableDataView.tsx
function Zr({ columns: e, tableProps: t, showScopeNote: r = !0, clientPagination: i = !1 }) {
	let { t: a } = Y(), [o, s] = n.useState(), { config: c, state: u, rows: d, appliedFields: f, filteredRows: p, sortedRows: m, serverQuery: h, visibleRows: g, totalCount: _, groups: v, rowColors: y, rowMarkerColors: b, cellColors: x, columnColors: S, updateDraft: C, updateSorts: w } = Z(), { savedView: T, draftView: E } = u, D = JSON.stringify([
		T.filters,
		T.sorts,
		T.groups,
		d.length
	]), O = n.useRef(D);
	n.useEffect(() => {
		O.current !== D && (O.current = D, !h && t.page !== 1 && t.onPageChange(1));
	}, [
		h,
		t.onPageChange,
		t.page,
		D
	]);
	let k = Math.max(1, Math.ceil((i ? p.length : _) / t.pageSize)), A = i ? Math.min(Math.max(1, t.page), k) : t.page, j = n.useMemo(() => i ? m.slice((A - 1) * t.pageSize, A * t.pageSize) : g, [
		i,
		A,
		m,
		t.pageSize,
		g
	]), M = n.useMemo(() => i && v.length ? ti(v, new Set(j.map(c.rowKey)), c.rowKey) : v, [
		i,
		c.rowKey,
		v,
		j
	]), N = n.useMemo(() => {
		let t = new Set(e.map(ei));
		return f.filter((e) => e.source !== "business" && !t.has(e.fieldId)).sort((e, t) => Number(t.source === "ai") - Number(e.source === "ai")).map((e) => ni(e, c.rowKey));
	}, [
		f,
		e,
		c.rowKey
	]), P = n.useMemo(() => {
		let t = [], n = [];
		for (let r of e) {
			let e = ei(r), i = r.meta?.sticky === "right";
			e === "actions" || i ? n.push(r) : t.push(r);
		}
		let r = t.findIndex((e) => ei(e) === c.dynamicColumnAnchorFieldId);
		return r < 0 ? [
			...t,
			...N,
			...n
		] : [
			...t.slice(0, r + 1),
			...N,
			...t.slice(r + 1),
			...n
		];
	}, [
		e,
		c.dynamicColumnAnchorFieldId,
		N
	]), F = n.useMemo(() => P.map(ei).filter((e) => e && e !== "__select__" && e !== "actions"), [P]), ee = n.useMemo(() => {
		let e = new Set(F), t = new Set(o?.visible ?? F), n = o?.order ?? F;
		return [...n.filter((t) => e.has(t)), ...F.filter((e) => !n.includes(e))].filter((e) => t.has(e));
	}, [F, o]), I = X(E.frozenColumnCount, ee.length), te = ee.slice(0, I), ne = n.useCallback((e) => {
		s(e);
	}, []), L = P.some((e) => ei(e) === "__select__") ? "__select__" : F[0], R = n.useCallback((e) => {
		let t = E.collapsedGroupKeys;
		C({ collapsedGroupKeys: t.includes(e) ? t.filter((t) => t !== e) : [...t, e] });
	}, [E.collapsedGroupKeys, C]), re = n.useCallback((e) => {
		let t = T.sorts.map((e) => ({
			id: e.fieldId,
			desc: e.direction === "desc"
		})), n = typeof e == "function" ? e(t) : e;
		w(n.map(({ id: e, desc: t }) => ({
			fieldId: e,
			direction: t ? "desc" : "asc"
		})));
	}, [T.sorts, w]);
	return /* @__PURE__ */ l(Xr, {
		...t,
		columns: P,
		data: j,
		page: A,
		total: i ? p.length : _,
		serverSorting: h ? T.sorts.map((e) => ({
			id: e.fieldId,
			desc: e.direction === "desc"
		})) : void 0,
		onServerSortingChange: h ? re : void 0,
		emptyText: T.filters.length ? a("aiTable.dataView.noFilteredRecords") : t.emptyText,
		rowStyle: (e) => Ye(y.get(c.rowKey(e))),
		cellStyle: (e, t) => {
			let n = c.rowKey(e);
			return {
				...Ye(x.get(n)?.get(t) ?? S.get(t)),
				...t === L ? Xe(b.get(n)) : void 0
			};
		},
		columnStyle: (e) => Ye(S.get(e)),
		groups: M.length ? M : void 0,
		onGroupToggle: R,
		frozenLeftColumnIds: te,
		onFrozenColumnCountChange: (e) => C({ frozenColumnCount: Math.max(1, e) }),
		minFrozenColumnCount: 1,
		columnSettings: t.columnSettings,
		onColumnSettingsStateChange: t.columnSettings ? ne : void 0,
		viewToolbar: /* @__PURE__ */ l(lr, {}),
		viewStatus: /* @__PURE__ */ l(fr, {}),
		showColumnControls: !1,
		scopeNote: r ? /* @__PURE__ */ l("span", { children: a("aiTable.dataView.scopeNote", {
			filtered: p.length,
			total: _
		}) }) : void 0
	});
}
function Qr({ columns: e, tableProps: t, showScopeNote: n = !0, clientPagination: r = !1 }) {
	let { config: i, state: a, rows: o, totalCount: s } = Z();
	if (a.modeTransition === "switching-to-smart") return /* @__PURE__ */ l(cn, {
		...i.switchingLoaderCopy,
		className: "smart-table-loader-embedded"
	});
	if (a.mode === "classic") {
		let n = Math.max(1, Math.ceil(s / t.pageSize)), i = r ? Math.min(Math.max(1, t.page), n) : t.page, a = r ? o.slice((i - 1) * t.pageSize, i * t.pageSize) : o;
		return /* @__PURE__ */ l(Xr, {
			...t,
			columns: e,
			data: a,
			page: i,
			total: s
		});
	}
	return /* @__PURE__ */ l(Zr, {
		columns: e,
		tableProps: t,
		showScopeNote: n,
		clientPagination: r
	});
}
function $r({ config: e, rows: t, totalCount: n, columns: r, tableProps: i }) {
	return /* @__PURE__ */ l(zt, {
		config: e,
		rows: t,
		totalCount: n,
		children: /* @__PURE__ */ l(Qr, {
			columns: r,
			tableProps: i
		})
	});
}
function ei(e) {
	return String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""));
}
function ti(e, t, n) {
	return e.flatMap((e) => {
		let r = e.rows.filter((e) => t.has(n(e))), i = e.children ? ti(e.children, t, n) : void 0, a = i?.length ? i.reduce((e, t) => e + t.count, 0) : r.length;
		return a === 0 ? [] : [{
			...e,
			rows: r,
			children: i,
			count: a
		}];
	});
}
function ni(e, t) {
	return {
		id: e.fieldId,
		header: () => /* @__PURE__ */ u("span", {
			className: "flex items-center gap-1.5 whitespace-nowrap",
			children: [e.source === "ai" ? /* @__PURE__ */ l(B, { className: "size-3.5 text-primary" }) : null, e.label.replace("（Demo派生）", "")]
		}),
		size: e.type === "number" ? 120 : 150,
		cell: ({ row: n }) => {
			let r = e.getValue(n.original);
			if (r == null || r === "") return /* @__PURE__ */ l("span", {
				className: "text-muted-foreground",
				children: "—"
			});
			if (e.fieldId.toLowerCase().includes("progress") && typeof r == "number") return /* @__PURE__ */ u("div", {
				className: "flex min-w-24 items-center gap-2",
				children: [/* @__PURE__ */ u("span", {
					className: "w-8 text-right text-xs tabular-nums",
					children: [r, "%"]
				}), /* @__PURE__ */ l(mr, {
					value: r,
					className: "h-1.5 flex-1"
				})]
			});
			if (e.source === "ai" || e.type === "tag") return /* @__PURE__ */ l(ri, { value: String(r) });
			let i = e.formatValue?.(r, n.original) ?? String(r);
			return /* @__PURE__ */ l("span", {
				className: "text-sm",
				title: `${t(n.original)} · ${i}`,
				children: i
			});
		}
	};
}
function ri({ value: e }) {
	let { t } = Y(), n = e.toUpperCase();
	return /* @__PURE__ */ l(Bn, {
		variant: n.includes("HIGH") || e.includes(t("aiTable.badge.highRisk")) ? "rejected" : n.includes("MEDIUM") || n.includes("ATTENTION") || e.includes(t("aiTable.badge.attention")) || e.includes(t("aiTable.badge.mediumRisk")) ? "pending" : "approved",
		children: n === "HIGH" ? t("aiTable.badge.highRisk") : n === "MEDIUM" ? t("aiTable.badge.mediumRisk") : n === "LOW" ? t("aiTable.badge.lowRisk") : n === "ATTENTION" ? t("aiTable.badge.attention") : n === "NORMAL" ? t("aiTable.badge.normal") : e
	});
}
//#endregion
//#region src/mocks/ai-table/mock-scenarios.ts
var ii = [
	{
		keywords: [
			"今天",
			"发货",
			"缺货"
		],
		rules: [{
			id: "mock-filter-1",
			fieldId: "expectedShipDate",
			operator: "equals",
			value: "today",
			conjunction: "and"
		}, {
			id: "mock-filter-2",
			fieldId: "demoShortageSkuCount",
			operator: "greaterThan",
			value: 0,
			conjunction: "and"
		}],
		explanation: "已按\"今天发货并且存在缺货的订单\"生成筛选条件"
	},
	{
		keywords: ["高风险"],
		rules: [{
			id: "mock-filter-3",
			fieldId: "aiFulfillmentRisk",
			operator: "equals",
			value: "HIGH",
			conjunction: "and"
		}],
		explanation: "已按\"高风险\"生成筛选条件"
	},
	{
		keywords: ["未分配", "进度"],
		rules: [{
			id: "mock-filter-4",
			fieldId: "assignee",
			operator: "isEmpty",
			conjunction: "and"
		}, {
			id: "mock-filter-5",
			fieldId: "pickProgress",
			operator: "lessThan",
			value: 80,
			conjunction: "and"
		}],
		explanation: "已按\"未分配且进度低于80%\"生成筛选条件"
	}
], ai = [
	{
		keywords: [
			"缺货",
			"大于",
			"标红"
		],
		rules: [{
			id: "mock-color-1",
			scope: "cell",
			fieldId: "demoShortageSkuCount",
			operator: "greaterThan",
			value: 3,
			colorToken: "red"
		}],
		explanation: "已按\"缺货SKU数大于3的单元格标红\"生成填色规则"
	},
	{
		keywords: [
			"完成",
			"整行",
			"标绿"
		],
		rules: [{
			id: "mock-color-2",
			scope: "row",
			fieldId: "status",
			operator: "equals",
			value: "COMPLETED",
			colorToken: "lightGreen"
		}],
		explanation: "已按\"已完成记录整行标绿\"生成填色规则"
	},
	{
		keywords: [
			"阻塞",
			"整行",
			"标红"
		],
		rules: [{
			id: "mock-color-3",
			scope: "row",
			fieldId: "demoBlockReason",
			operator: "notEmpty",
			colorToken: "red"
		}],
		explanation: "已按\"阻塞任务整行标红\"生成填色规则"
	},
	{
		keywords: [
			"高风险",
			"整行",
			"标红"
		],
		rules: [{
			id: "mock-color-4",
			scope: "row",
			fieldId: "aiFulfillmentRisk",
			operator: "equals",
			value: "HIGH",
			colorToken: "lightRed"
		}],
		explanation: "已按\"高风险订单整行标红\"生成填色规则"
	},
	{
		keywords: [
			"受控",
			"整行",
			"标绿"
		],
		rules: [{
			id: "mock-color-5",
			scope: "row",
			fieldId: "aiFulfillmentRisk",
			operator: "equals",
			value: "LOW",
			colorToken: "lightGreen"
		}],
		explanation: "已按\"已受控订单整行标绿\"生成填色规则"
	}
];
function oi(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n) | 0;
	return Math.abs(t);
}
function si(e, t, n) {
	let r = oi(`${e.fieldId}:${t}`), i = `${e.name} ${e.prompt}`;
	if (/履约|风险|risk/i.test(i)) {
		let e = Number(n.pickProgress ?? n.demoPickProgress ?? 0), t = Number(n.demoShortageSkuCount ?? n.shortageSkuCount ?? 0);
		return e < 30 && t > 3 ? {
			value: "HIGH",
			status: "SUCCESS"
		} : e >= 80 || t === 0 ? {
			value: "LOW",
			status: "SUCCESS"
		} : {
			value: "MEDIUM",
			status: "SUCCESS"
		};
	}
	if (/阻塞|block/i.test(i)) {
		let e = String(n.status ?? ""), t = n.assignee, r = Number(n.pickProgress ?? 0);
		return e === "PENDING" && !t ? {
			value: "HIGH",
			status: "SUCCESS"
		} : r < 50 && e === "IN_PROGRESS" ? {
			value: "ATTENTION",
			status: "SUCCESS"
		} : {
			value: "NORMAL",
			status: "SUCCESS"
		};
	}
	return e.outputType === "number" ? {
		value: r % 101,
		status: "SUCCESS"
	} : {
		value: [
			"正常",
			"需关注",
			"高风险"
		][r % 3],
		status: "SUCCESS"
	};
}
//#endregion
//#region src/mocks/ai-table/mock-adapter.ts
function ci() {
	return new Promise((e) => setTimeout(e, 1e3));
}
function li(e, t) {
	let n = e.toLowerCase();
	return t.every((e) => n.includes(e.toLowerCase()));
}
function ui() {
	return {
		async generateFilters(e) {
			await ci();
			for (let t of ii) if (li(e.instruction, t.keywords)) {
				let n = new Set(e.fields.map((e) => e.fieldId));
				return t.rules.filter((e) => n.has(e.fieldId)).map((e, t) => ({
					...e,
					id: `ai-filter-${Date.now()}-${t}`
				}));
			}
			return [];
		},
		async generateColorRules(e) {
			await ci();
			for (let t of ai) if (li(e.instruction, t.keywords)) {
				let n = new Set(e.fields.map((e) => e.fieldId));
				return t.rules.filter((e) => n.has(e.fieldId)).map((e, t) => ({
					...e,
					id: `ai-color-${Date.now()}-${t}`
				}));
			}
			return [];
		},
		async previewAIField(e) {
			return await ci(), e.rows.map((t) => {
				let n = e.rowKey(t);
				try {
					let r = {};
					for (let n of e.definition.referencedFieldIds) {
						let i = e.fields.find((e) => e.fieldId === n);
						i && (r[n] = i.getValue(t));
					}
					return {
						rowKey: n,
						value: si(e.definition, n, r).value
					};
				} catch (e) {
					return {
						rowKey: n,
						error: e instanceof Error ? e.message : J.t("aiTable.mock.generateFailed", "生成失败")
					};
				}
			});
		}
	};
}
//#endregion
//#region src/components/ai-table/AIWmsDataTable.tsx
var di = /* @__PURE__ */ new Set(["__select__", "actions"]), fi = /^\d{4}-\d{2}-\d{2}/;
function pi(e) {
	return String(e.id ?? ("accessorKey" in e ? e.accessorKey : ""));
}
function mi(e) {
	return typeof e == "number" && e > 1e9 ? "datetime" : typeof e == "number" ? "number" : typeof e == "string" && fi.test(e) ? "datetime" : "text";
}
function hi(e, t) {
	for (let n of e) {
		let e = t(n);
		if (e != null && e !== "") return e;
	}
}
function gi(e, t, n, r) {
	let i = new Map((n ?? []).map((e) => [e.fieldId, e])), a = [];
	for (let n of e) {
		let e = pi(n);
		if (!e || di.has(e) || n.meta?.sticky === "right") continue;
		let r = i.get(e), o = r?.getValue ?? ((t) => t[e]), s = r?.type;
		if (!s) if (r?.options) s = "tag";
		else {
			let e = hi(t, o);
			s = e === void 0 ? "text" : mi(e);
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
function _i(e) {
	if (!(e.enabled ?? !0)) {
		let { aiTable: t, enabled: n, ...r } = e;
		return /* @__PURE__ */ l(Xr, { ...r });
	}
	return /* @__PURE__ */ l(vi, { ...e });
}
function vi(e) {
	let { aiTable: t, columns: r, data: i, total: a, getRowId: o, enabled: s, ...c } = e, { tableId: u, rowKey: d, fieldOverrides: f, extraFields: p, dynamicColumnAnchorFieldId: m, switchingLoaderCopy: h, aiAdapter: g } = t, _ = n.useCallback((e) => String(i.indexOf(e)), [i]), v = d ?? o ?? _;
	return /* @__PURE__ */ l(zt, {
		config: n.useMemo(() => ({
			tableId: u,
			rowKey: v,
			fields: gi(r, i, f, p),
			aiAdapter: g ?? ui(),
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
		children: /* @__PURE__ */ l(Qr, {
			columns: r,
			tableProps: {
				...c,
				getRowId: o
			}
		})
	});
}
//#endregion
//#region src/adapters/demo.ts
function yi(e = 300) {
	let t = () => new Promise((t) => setTimeout(t, e));
	return {
		async generateFilters({ instruction: e, fields: n }) {
			await t();
			for (let t of n.filter((e) => e.filterable)) {
				if (!e.includes(t.label)) continue;
				let n = e.slice(e.indexOf(t.label) + t.label.length).trim(), r = n.match(/^(>=|<=|>|<|=|大于|小于|等于)\s*(-?\d+(?:\.\d+)?)/);
				if (r && t.type === "number") return [{
					id: "demo-filter",
					fieldId: t.fieldId,
					operator: {
						">": "greaterThan",
						"<": "lessThan",
						">=": "greaterThanOrEqual",
						"<=": "lessThanOrEqual",
						"=": "equals",
						大于: "greaterThan",
						小于: "lessThan",
						等于: "equals"
					}[r[1]],
					value: Number(r[2]),
					conjunction: "and"
				}];
				let i = n.match(/^(包含|contains|等于|=)\s*(.+)/i);
				if (i) return [{
					id: "demo-filter",
					fieldId: t.fieldId,
					operator: /包含|contains/i.test(i[1]) ? "contains" : "equals",
					value: i[2].trim(),
					conjunction: "and"
				}];
			}
			return [];
		},
		async generateColorRules({ instruction: e, fields: n }) {
			await t();
			let r = n.find((t) => t.colorable && e.includes(t.label)), i = e.match(/(?:>|大于)\s*(\d+(?:\.\d+)?)/);
			return !r || !i || r.type !== "number" ? [] : [{
				id: "demo-color",
				scope: "cell",
				fieldId: r.fieldId,
				operator: "greaterThan",
				value: Number(i[1]),
				colorToken: "lightRed"
			}];
		},
		async previewAIField({ definition: e, rows: n, rowKey: r, fields: i }) {
			return await t(), n.map((t) => ({
				rowKey: r(t),
				value: bi(e, t, i)
			}));
		}
	};
}
function bi(e, t, n) {
	let r = e.referencedFieldIds.map((e) => n.find((t) => t.fieldId === e && t.aiReadable)?.getValue(t));
	return e.outputType === "number" ? r.reduce((e, t) => e + (typeof t == "number" ? t : 0), 0) : e.outputType === "tag" ? "DEMO" : `[DEMO] ${r.map((e) => String(e ?? "—")).join(" · ")}`;
}
//#endregion
//#region src/declarative.tsx
function xi(e) {
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
function Si(e) {
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
function Ci({ definition: e, rows: t, storageScope: r, defaultMode: i = "classic", modeLock: a, enabled: o = !0, showModeSwitch: s = !0, showScopeNote: c = !0, className: d, leadingColumns: f, additionalColumns: p, page: m, pageSize: h, onPageChange: g, onPageSizeChange: _, onQueryChange: v, queryFieldIds: y, ...b }) {
	let x = m !== void 0 && g !== void 0, [S, C] = n.useState(m ?? 1), [w, T] = n.useState(h ?? 10), E = x ? m : S, D = x ? h ?? 10 : w, O = x ? g : C, k = x ? _ : (e) => {
		T(e), C(1);
	}, A = n.useMemo(() => Si(e), [e]), j = n.useMemo(() => [
		...f ?? [],
		...A.columns,
		...p ?? []
	], [
		p,
		A,
		f
	]), M = n.useMemo(() => e.ai.mode === "demo" ? yi() : e.ai.adapter, [e.ai]);
	if (!r.trim()) throw Error("storageScope is required");
	let N = t.map(e.rowKey);
	if (N.some((e) => !e) || new Set(N).size !== N.length) throw Error("Rows must have unique, nonempty business keys");
	let P = JSON.stringify([r, e.id]), F = {
		tableId: P,
		rowKey: e.rowKey,
		fields: A.fields,
		aiAdapter: M,
		demoScope: "CURRENT_PAGE",
		dynamicColumnAnchorFieldId: e.dynamicColumnAnchorFieldId,
		switchingLoaderCopy: e.switchingLoaderCopy
	}, ee = x ? t : t.slice((E - 1) * D, E * D), I = {
		...b,
		page: E,
		pageSize: D,
		onPageChange: O,
		onPageSizeChange: k,
		total: x ? b.total : t.length
	};
	return /* @__PURE__ */ l("div", {
		className: Q("ai-table-plugin", d),
		"data-ai-table-id": e.id,
		children: o ? /* @__PURE__ */ u(zt, {
			config: F,
			rows: t,
			totalCount: b.total,
			defaultMode: i,
			modeLock: a,
			onQueryChange: v,
			queryFieldIds: y,
			children: [s ? /* @__PURE__ */ l("div", {
				className: "mb-3 flex justify-end",
				children: /* @__PURE__ */ l(tn, {})
			}) : null, /* @__PURE__ */ l(Qr, {
				columns: j,
				tableProps: {
					...I,
					getRowId: e.rowKey
				},
				showScopeNote: c,
				clientPagination: !x
			})]
		}, P) : /* @__PURE__ */ l(_i, {
			...I,
			enabled: !1,
			columns: j,
			data: ee,
			getRowId: e.rowKey,
			aiTable: {
				tableId: P,
				aiAdapter: M
			}
		})
	});
}
//#endregion
//#region src/adapters/http.ts
function wi(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Invalid AI response object");
	return e;
}
function Ti(e) {
	if (!Array.isArray(e)) throw Error("AI response must be an array");
	return e;
}
function Ei(e) {
	return e.map(({ fieldId: e, label: t, type: n, options: r }) => ({
		fieldId: e,
		label: t,
		type: n,
		options: r
	}));
}
function Di(e, t, n) {
	let r = wi(e), i = t.find((e) => e.fieldId === r.fieldId && e[n] && e.aiReadable);
	if (!i) throw Error(`Unknown or unavailable AI field: ${String(r.fieldId)}`);
	if (!He(i.type).some((e) => e.value === r.operator)) throw Error("Invalid AI rule operator");
	if (typeof r.id != "string" || !r.id) throw Error("AI rule id is required");
	return r;
}
function Oi({ request: e }) {
	return {
		async generateFilters({ instruction: t, fields: n }) {
			let r = n.filter((e) => e.aiReadable && e.filterable);
			return Ti(await e("filters", {
				instruction: t,
				fields: Ei(r)
			})).map((e) => {
				let t = Di(e, r, "filterable");
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
			return Ti(await e("colors", {
				instruction: t,
				fields: Ei(r)
			})).map((e) => {
				let t = Di(e, r, "colorable");
				if (![
					"cell",
					"row",
					"rowMarker",
					"column"
				].includes(String(t.scope))) throw Error("Invalid AI color scope");
				if (!Ge.some((e) => e.value === t.colorToken) && ![
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
				fields: Ei(a),
				rows: n.map((e) => ({
					rowKey: r(e),
					values: Object.fromEntries(a.map((t) => [t.fieldId, t.getValue(e)]))
				}))
			}), c = /* @__PURE__ */ new Set();
			return Ti(s).map((e) => {
				let n = wi(e);
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
export { Rn as AIColorPanel, Ci as AIDataTable, Zn as AIFieldPanel, rr as AIFilterPanel, ar as AIGroupingPanel, sr as AISortingPanel, un as AITableClassicOnly, nr as AITableConditionBuilder, Qr as AITableContent, $r as AITableDataView, fr as AITableDraftBar, pr as AITableFreezeBoundary, ln as AITableGlobalModeSwitch, tn as AITableModeSwitch, dn as AITablePageHeader, zt as AITableProvider, At as AITableShellProvider, lr as AITableToolbar, _i as AIWmsDataTable, Xr as BaseDataTable, Ge as COLOR_OPTIONS, We as COLOR_PALETTE_ROWS, cn as SmartTableSwitchingLoader, tt as UNGROUPED_LABEL, $e as applyFilters, nt as applyGrouping, et as applySorting, Dt as clearAIFieldValues, Si as compileAITable, Ve as createDefaultViewConfig, yi as createDemoAdapter, Oi as createHttpAIAdapter, st as createRowProjection, ui as createWmsDemoAdapter, xi as defineAITable, rt as flattenGroups, lt as generateId, Je as getColorOption, Ye as getColorStyle, gt as getColorSummary, Ze as getFieldById, ut as getFilterSummary, dt as getGroupSummary, He as getOperatorsByFieldType, Xe as getRowMarkerStyle, ft as getSortSummary, ot as isDirty, Tt as loadAIValues, xt as loadMode, Ct as loadView, X as normalizeFrozenColumnCount, ct as normalizeViewConfig, it as resolveColorRules, at as resolveColumnColorRules, Et as saveAIValues, St as saveMode, wt as saveView, Ot as setAIFieldValue, Be as setAITableLanguage, Z as useAITable, qr as withSelectionColumn };

//# sourceMappingURL=ai-table.js.map