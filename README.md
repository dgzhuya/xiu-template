# xiu-template

> 配合`@biuxiu/template`实现模板工具类型提示功能
>

### v 1.3.0
- 重写代码高亮逻辑
- 实现代码格式化功能
- 添加and和or函数


### v 1.2.3
- 修复for语句块bug

### v 1.2.1
- 支持for循环语句
  ```btpl
  {% for@list %} {% $i %}	{% end@ %}
  ```
- 在vscode中支持错误警告

### v 1.2.0
- 支持条件判断语句
  ```btpl
  {% if@test %} test str! {% end@ %}
  ```

### v 1.1.0
- 实现语法高亮
- 美化图标
- 实现代码编辑提示