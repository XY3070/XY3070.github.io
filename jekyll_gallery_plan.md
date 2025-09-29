# Jekyll Gallery Vibe Coding 开发文档

本开发文档分阶段推进 Jekyll Gallery 模块，从基础修复到增强功能。目标是确保 **相册访问不再 404**，并逐步增加交互与管理功能。

---

## 阶段 1：修复 404 问题

### 1.1 检查 GitHub Pages 部署类型
- **用户主页仓库**：仓库名为 `<username>.github.io` → `baseurl: ""`
- **项目页仓库**：仓库名为其他（如 `gallery-project`）→ `baseurl: "/gallery-project"`

### 1.2 修改 `_config.yml`
```yaml
collections:
  gallery_albums:
    output: true
    permalink: /gallery/:name/

# 根据情况选择
baseurl: ""              # 用户主页
# baseurl: "/repo-name"   # 项目页
```

### 1.3 修改图片路径（避免 404）
在相册 Markdown 文件（如 `travel-HK.md`）中：
```yaml
cover_image: "{{ site.baseurl }}/images/gallery/travel-HK/红花.png"
photos:
  - image: "{{ site.baseurl }}/images/gallery/travel-HK/红花.png"
    title: "Hong Kong Flower"
    caption: "2023年夏，在巴黎埃菲尔铁塔下，感受法式浪漫。"
  - image: "{{ site.baseurl }}/images/gallery/travel-HK/japan_sakura.jpg"
    title: "京都樱花盛开"
    caption: "2022年春，京都的樱花如雪般绽放，美不胜收。"
```

### 1.4 本地验证
```bash
bundle exec jekyll serve
```
检查 `_site/gallery/travel-HK/index.html` 是否生成，并用浏览器打开 `http://127.0.0.1:4000/gallery/travel-HK/`。

---

## 阶段 2：增强用户体验

### 2.1 图片放大 (Lightbox)
- 在 `_layouts/gallery_album.html` 引入 Lightbox JS 库（如 [lightgallery.js](https://sachinchoolur.github.io/lightGallery/)）。
- 修改模板：
  ```liquid
  {% for photo in page.photos %}
    <a href="{{ photo.image | relative_url }}" data-lg-size="1400-933">
      <img src="{{ photo.image | relative_url }}" alt="{{ photo.title }}">
    </a>
  {% endfor %}
  ```

### 2.2 懒加载图片
```html
<img src="{{ photo.image | relative_url }}" alt="{{ photo.title }}" loading="lazy">
```

### 2.3 美化 UI
- 使用 CSS Grid/Flexbox 排版卡片。
- 增加 hover 动效、阴影。

---

## 阶段 3：相册加密
- 简单实现：前端 JS 输入密码后才显示相册内容。
- 高级实现：接入 Firebase/Auth 或自建后端认证。

---

## 阶段 4：管理入口
- 写一个 Ruby/Python 脚本：输入相册名称 → 自动生成 `_gallery_albums/xxx.md` 与 `images/gallery/xxx/` 文件夹。
- 或使用 Netlify CMS/Decap CMS，提供网页表单上传。

---

## 开发节奏建议
1. **优先完成阶段 1** → 修复路径和 baseurl，解决 404。
2. **阶段 2 同步进行** → 提升体验，加入 lightbox + 懒加载。
3. 阶段 3 和 4 可视需求扩展。

---

✅ 完成阶段 1 后，访问 `https://<username>.github.io[/repo-name]/gallery/travel-HK/` 应不再出现 404。

