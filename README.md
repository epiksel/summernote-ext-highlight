# Summernote Syntax Highlighting
Based on [Google code-prettify](https://github.com/google/code-prettify) the [Summernote](https://github.com/summernote/summernote) code highlighting plugin. [Color themes](http://jmblog.github.io/color-themes-for-google-code-prettify/) for Google Code Prettify

[DEMO PAGE](https://epiksel.github.io/summernote-highlight)

## Setup
 * Include summernote project script
 * Include the script tag below in your document
```HTML
<script src="http://your domain/summernote-ext-highlight.js"></script>
```

## Usage
 * Configuration summernote toolbar
```javascript
$('.summernote').summernote({
    height: 200,
    tabsize: 2,
    // close prettify Html
    prettifyHtml:false,
    toolbar:[
        // Add highlight plugin
        ['highlight', ['highlight']],
    ],
    lang:'tr-TR'
});
```
## Contacts
* Twitter: https://twitter.com/epiksel
* Website: https://e-piksel.com

## License
summernote-ext-highlight may be freely distributed under the MIT license.
