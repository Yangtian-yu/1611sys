# 1611 值日系统 - UI 原型图提示词集合

**项目名称**：1611 值日系统  
**设计日期**：2026-01-16  
**设计工具**：Nano Banana Pro (Gemini 3 Pro Image)

---

## 设计规范总览

### 配色方案

- **主色**：#409EFF（Element Plus 蓝）
- **背景色**：#FFFFFF（白色）
- **辅助背景**：#F5F7FA（浅灰）
- **危险色**：#F56C6C（红色，用于删除按钮）
- **成功色**：#67C23A（绿色，用于成功状态）

### 字体规范

- **主字体**：Sans-serif（无衬线字体）
- **标题字号**：24px - 32px
- **正文字号**：14px - 16px
- **小字**：12px

### 组件规范

- **圆角**：8px（卡片）、4px（按钮）
- **阴影**：0 2px 12px 0 rgba(0, 0, 0, 0.1)
- **间距**：16px（标准间距）、24px（大间距）

### 设计风格

- 遵循 Element Plus 设计语言
- 简洁、专业的企业级应用风格
- 清晰的信息层级
- 良好的可读性

---

## 页面 1：登录页

### 提示词

```
Professional web application login page UI mockup for '1611值日系统' (1611 Duty System).

**Layout:**
- Top center: System logo and title '1611值日系统' in clean sans-serif font
- Center: White card with login form on light gray background
- Form contains: username input field labeled '用户名', password input field labeled '密码', and blue login button labeled '登录'
- Bottom of card: Small text '办公室值日管理系统'

**Visual Style:**
- Color scheme: Primary blue (#409EFF), white background (#FFFFFF), light gray (#F5F7FA)
- Typography: Clean sans-serif, modern and professional
- Theme: Minimalist business application style, Element Plus design language

**Key Elements:**
- Title must show exactly '1611值日系统'
- Input labels must show '用户名' and '密码'
- Login button must show '登录'
- Subtitle text '办公室值日管理系统'
- Rounded corners on card (8px)
- Subtle shadow on login card

**Quality:** Clean UI design, professional business application, sharp text rendering, 1920x1080 resolution
```

### 设计说明

- **页面类型**：登录页
- **核心功能**：用户名密码登录
- **关键元素**：
  - 系统标题：1611 值日系统
  - 输入框：用户名、密码
  - 登录按钮
  - 副标题：办公室值日管理系统

### 生成的原型图

![登录页原型](./assets/login_page.png)

---

## 页面 2：值日排班查看页（员工视图）

### 提示词

```
Professional web application dashboard UI mockup for '1611值日系统' duty schedule viewing page.

**Layout:**
- Top navigation bar: Logo '1611值日系统' on left, user info '张三' with logout button on right
- Main content area: Large card showing current week duty schedule
- Card header: '本周值日安排' with current week date range '2026年1月13日 - 1月17日'
- Card body: Two large user avatars with names '李明' and '王芳' displayed prominently
- Bottom text: '值日时间：本周五下午' in gray color
- Sidebar menu on left: '值日安排', '修改密码' menu items

**Visual Style:**
- Color scheme: Primary blue (#409EFF), white (#FFFFFF), light gray background (#F5F7FA)
- Typography: Clean sans-serif, Element Plus design system
- Theme: Modern business dashboard, clean and spacious layout

**Key Elements:**
- Top bar must show '1611值日系统' and '张三'
- Card title must show '本周值日安排'
- Date range must show '2026年1月13日 - 1月17日'
- Duty personnel names '李明' and '王芳' with avatar icons
- Bottom text '值日时间：本周五下午'
- Menu items '值日安排' and '修改密码'
- Clean card design with subtle shadows

**Quality:** Professional business application UI, sharp text, clean layout, 1920x1080 resolution
```

### 设计说明

- **页面类型**：仪表盘（员工视图）
- **核心功能**：查看本周值日人员
- **关键元素**：
  - 顶部导航：系统名称、用户信息、退出登录
  - 侧边栏菜单：值日安排、修改密码
  - 主内容区：本周值日安排卡片
  - 值日人员头像和姓名
  - 值日时间提示

### 生成的原型图

![值日排班查看页原型](./assets/duty_schedule_page.png)

---

## 页面 3：员工管理页（管理员视图）

### 提示词

```
Professional web application admin panel UI mockup for '1611值日系统' employee management page.

**Layout:**
- Top navigation bar: Logo '1611值日系统' on left, admin user 'admin' with logout button on right
- Sidebar menu on left: '值日安排', '员工管理' (highlighted), '邮件设置' menu items
- Main content area: Employee management table
- Table header: '员工管理' title with blue '+ 添加员工' button on right
- Table columns: '序号', '姓名', '邮箱', '角色', '操作'
- Table rows showing 5 employees with drag handles, names like '张三', '李四', emails, role badges
- Action buttons in each row: '编辑', '重置密码', '删除' in blue/red colors
- Pagination at bottom: '共15条' with page numbers

**Visual Style:**
- Color scheme: Primary blue (#409EFF), white (#FFFFFF), light gray (#F5F7FA), red for delete (#F56C6C)
- Typography: Clean sans-serif, Element Plus table design
- Theme: Professional admin dashboard with data table

**Key Elements:**
- Title must show '员工管理'
- Button must show '+ 添加员工'
- Column headers: '序号', '姓名', '邮箱', '角色', '操作'
- Sample data with Chinese names and QQ emails
- Action buttons: '编辑', '重置密码', '删除'
- Drag handle icons for reordering
- Clean table design with hover effects

**Quality:** Professional business admin UI, sharp text, organized data table, 1920x1080 resolution
```

### 设计说明

- **页面类型**：数据表格页（管理员视图）
- **核心功能**：员工信息管理、顺序调整
- **关键元素**：
  - 侧边栏菜单：值日安排、员工管理（高亮）、邮件设置
  - 页面标题：员工管理
  - 添加员工按钮
  - 数据表格：序号、姓名、邮箱、角色、操作
  - 拖拽手柄（用于调整顺序）
  - 操作按钮：编辑、重置密码、删除
  - 分页器

### 生成的原型图

![员工管理页原型](./assets/employee_management_page.png)

---

## 页面 4：邮件模板编辑页（管理员视图）

### 提示词

```
Professional web application admin panel UI mockup for '1611值日系统' email template editing page.

**Layout:**
- Top navigation bar: Logo '1611值日系统' on left, admin user 'admin' with logout button on right
- Sidebar menu on left: '值日安排', '员工管理', '邮件设置' (highlighted) menu items
- Main content area: Email template editor
- Page title: '邮件通知设置'
- Large textarea showing email template with placeholder text:
  "【1611值日系统】本周值日通知

  本周值日人员：{值日人员}

  值日时间：本周五下午
  请准时完成值日工作，谢谢配合！"
- Below textarea: Helper text '支持变量：{值日人员}, {日期}'
- Bottom right: Blue '保存' button and gray '测试发送' button

**Visual Style:**
- Color scheme: Primary blue (#409EFF), white (#FFFFFF), light gray (#F5F7FA)
- Typography: Clean sans-serif, Element Plus form design
- Theme: Professional admin settings page

**Key Elements:**
- Title must show '邮件通知设置'
- Template text with variables {值日人员} and {日期}
- Helper text '支持变量：{值日人员}, {日期}'
- Buttons: '保存' (blue) and '测试发送' (gray)
- Clean form layout with proper spacing
- Textarea with monospace font for template

**Quality:** Professional business admin UI, sharp text, clean form design, 1920x1080 resolution
```

### 设计说明

- **页面类型**：表单编辑页（管理员视图）
- **核心功能**：编辑邮件通知模板
- **关键元素**：
  - 侧边栏菜单：值日安排、员工管理、邮件设置（高亮）
  - 页面标题：邮件通知设置
  - 大文本框：邮件模板内容
  - 变量提示：支持 {值日人员}、{日期}
  - 操作按钮：保存、测试发送

### 生成的原型图

![邮件模板编辑页原型](./assets/email_template_page.png)

---

## 交互流程说明

### 员工用户流程

1. **登录** → 进入值日排班查看页
2. 查看本周值日人员
3. 可选：修改自己的密码

### 管理员用户流程

1. **登录** → 进入值日排班查看页
2. 切换到**员工管理页**：
   - 添加新员工
   - 编辑员工信息
   - 调整员工顺序（拖拽）
   - 重置员工密码
   - 删除员工
3. 切换到**邮件设置页**：
   - 编辑邮件模板
   - 测试发送邮件
   - 保存设置

---

## 响应式设计说明

由于产品规格文档明确指出"仅支持桌面端访问"，本设计未考虑移动端适配。所有页面均按 1920x1080 桌面分辨率设计。

---

## 设计验收标准

- [x] 所有文字清晰可读，无模糊或拼写错误
- [x] 配色符合 Element Plus 设计规范
- [x] 布局清晰，信息层级分明
- [x] 交互元素（按钮、输入框）易于识别
- [x] 符合产品规格文档中的功能需求
