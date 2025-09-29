# Jekyll Gallery 结构文档

本文档旨在详细描述 Jekyll 网站中 `gallery` 部分的实现结构和工作原理，以便于理解和调试。

## 1. 核心概念

本 `gallery` 功能主要依赖 Jekyll 的 `collections` 特性来管理相册，并通过自定义布局和配置来生成相册页面。

## 2. 关键文件和目录

以下是 `gallery` 功能相关的关键文件和目录及其作用：

### 2.1 `_config.yml` (网站全局配置)

-   **作用**: Jekyll 网站的全局配置文件，定义了网站的各种设置，包括集合、永久链接、基础 URL 等。
-   **相关配置**:
    -   `collections`: 定义了名为 `gallery_albums` 的集合。
        ```yaml
        collections:
          gallery_albums:
            output: true
            permalink: /gallery/:name/
        ```
        -   `output: true`: 确保 `gallery_albums` 集合中的每个 Markdown 文件都会被 Jekyll 处理并生成独立的 HTML 页面。
        -   `permalink: /gallery/:name/`: 定义了 `gallery_albums` 集合中所有页面的 URL 结构。`:name` 会被 Markdown 文件的文件名（不含扩展名）替换。例如，`_gallery_albums/travel-HK.md` 将生成 `/gallery/travel-HK/` 的 URL。
    -   `baseurl: ""`
        -   **作用**: 对于 GitHub Pages 部署，`baseurl` 通常设置为空字符串 `""`，以确保生成的 URL 是相对于网站根目录的绝对路径，避免路径问题。

### 2.2 `gallery.html` (相册索引页)

-   **作用**: 这是显示所有相册卡片的索引页面。用户访问 `/gallery/` 时会看到此页面。
-   **实现**:
    -   通过 `{% for album in site.collections.gallery_albums %}` 循环遍历 `gallery_albums` 集合中的所有相册。
    -   每个相册卡片通过 `<a href="{{ album.url | relative_url }}" ...>` 生成链接。`album.url` 会根据 `_config.yml` 中为 `gallery_albums` 集合定义的 `permalink` 自动生成。
    -   `relative_url` 过滤器确保生成的 URL 是相对于 `baseurl` 的正确相对路径。
    -   显示相册的封面图片 (`album.cover_image` 或 `album.photos[0].image`)、标题 (`album.title`) 和描述 (`album.album_description`)。

### 2.3 `_gallery_albums/` (相册内容集合)

-   **作用**: 这是一个 Jekyll 集合目录，其中每个 Markdown 文件代表一个独立的相册页面。
-   **示例文件**: `_gallery_albums/travel-HK.md`
    -   **YAML Front Matter**: 每个 Markdown 文件的开头包含 YAML Front Matter，定义了相册的元数据。
        ```yaml
        ---
        layout: gallery_album
        title: Traveling: Hong Kong
        output: true # 明确指定输出，确保页面生成
        album_description: 香港。
        cover_image: /images/gallery/travel-HK/红花.png
        photos:
          - image: "/images/gallery/travel-HK/红花.png"
            title: "Hong Kong Flower"
            caption: "2023年夏，在巴黎埃菲尔铁塔下，感受法式浪漫。"
          - image: "/images/gallery/travel-HK/japan_sakura.jpg"
            title: "京都樱花盛开"
            caption: "2022年春，京都的樱花如雪般绽放，美不胜收。"
        ---
        ```
        -   `layout: gallery_album`: 指定使用 `_layouts/gallery_album.html` 作为此页面的布局。
        -   `title`, `album_description`, `cover_image`: 相册的标题、描述和封面图片。
        -   `output: true`: 明确指示 Jekyll 为此文件生成一个独立的页面。
        -   `photos`: 一个包含照片信息的列表，每张照片有 `image` (路径)、`title` 和 `caption`。

### 2.4 `_layouts/gallery_album.html` (单个相册页面布局)

-   **作用**: 这是用于渲染 `_gallery_albums/` 目录下每个相册 Markdown 文件的布局文件。
-   **实现**:
    -   通过 `{{ page.title }}`、`{{ page.album_description }}` 等 Liquid 标签，显示 Markdown 文件 Front Matter 中定义的元数据。
    -   通过 `{% for photo in page.photos %}` 循环遍历 `photos` 列表，显示每张照片及其标题和描述。
    -   包含 Lightbox 功能的 JavaScript (`/js/gallery.js`)，用于图片点击放大。

### 2.5 `images/gallery/` (图片存储目录)

-   **作用**: 存放所有相册图片资源的目录。图片路径在 `_gallery_albums/*.md` 文件中引用。

### 2.6 `.github/workflows/build.yml` (GitHub Actions 工作流)

-   **作用**: 定义了 GitHub Actions 的自动化构建和部署流程。当代码推送到 GitHub 仓库时，此工作流会运行 Jekyll 构建网站，并将生成的静态文件部署到 GitHub Pages。
-   **关键步骤**: 通常包括设置 Jekyll 环境、运行 `jekyll build` 命令生成 `_site` 目录，然后使用 `actions/upload-pages-artifact` 和 `actions/deploy-pages` 将 `_site` 目录的内容部署到 GitHub Pages。

## 3. 工作流程概述

1.  **内容创建**: 在 `_gallery_albums/` 目录下创建 Markdown 文件（例如 `travel-HK.md`），并定义其 YAML Front Matter，包括 `layout: gallery_album` 和 `output: true`。
2.  **Jekyll 构建**: 当代码推送到 GitHub 仓库时，GitHub Actions 会触发 `build.yml` 工作流。Jekyll 会读取 `_config.yml`、`gallery.html`、`_gallery_albums/*.md` 和 `_layouts/gallery_album.html`。
3.  **页面生成**:
    -   `gallery.html` 会被渲染成 `/gallery/index.html` (或 `/gallery/`)，其中包含所有相册的卡片链接。
    -   `_gallery_albums/travel-HK.md` 会根据 `_config.yml` 中 `gallery_albums` 集合的 `permalink: /gallery/:name/` 和 `_layouts/gallery_album.html` 布局，生成 `/gallery/travel-HK/index.html` (或 `/gallery/travel-HK/`)。
4.  **部署**: 生成的静态文件（位于 `_site` 目录）会被 GitHub Actions 部署到 GitHub Pages。
5.  **访问**: 用户通过 `https://<username>.github.io/gallery/` 访问相册索引页，通过 `https://<username>.github.io/gallery/travel-HK/` 访问具体的相册页面。

## 4. 调试要点

-   **GitHub Actions 日志**: 检查 `build.yml` 工作流的运行日志，确保 Jekyll 构建没有错误。
-   **本地构建**: 在本地运行 `bundle exec jekyll serve` 或 `jekyll build`，检查 `_site` 目录中是否生成了预期的 HTML 文件，以及文件路径是否正确。
-   **URL 结构**: 仔细核对 `_config.yml` 中的 `permalink` 和 `baseurl` 设置，以及 `gallery.html` 中 `album.url` 的生成，确保与实际访问路径一致。
-   **Front Matter**: 确认 `_gallery_albums/*.md` 文件中的 `layout` 和 `output: true` 设置正确。
-   **GitHub Pages 源**: 确保 GitHub Pages 的部署源分支（通常是 `main` 或 `gh-pages`）与 GitHub Actions 部署的分支一致。

希望这份文档能帮助您和 ChatGPT 更好地理解和解决问题！