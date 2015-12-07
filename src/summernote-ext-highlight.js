/*!
 * Summernote Syntax Highlighting
 * http://epiksel.github.io/summernote-ext-highlight/
 *
 * Released under the MIT license
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals: jQuery
        factory(window.jQuery);
    }
}(function ($) {
    // template
    var tmpl = $.summernote.renderer.getTemplate();

    // core functions: range, dom
    var range = $.summernote.core.range;
    var dom = $.summernote.core.dom;

    /**
     * createCodeNode
     *
     * @member plugin.highlight
     * @private
     * @param {String} code
     * @return {Node}
     */
    var createCodeNode = function (code, select) {
        var $code = $('<code>');
        $code.html(code.replace(/</g,"&lt;").replace(/>/g,"&gt;"));
        $code.addClass('language-' + select);

        var $pre = $('<pre>');
        $pre.html($code)
        $pre.addClass('prettyprint').addClass('linenums');

        return $pre[0];
    };

    var getTextOnRange = function ($editable) {
        $editable.focus();

        var rng = range.create();

        // if range on anchor, expand range with anchor
        if (rng.isOnAnchor()) {
            var anchor = dom.ancestor(rng.sc, dom.isAnchor);
            rng = range.createFromNode(anchor);
        }

        return rng.toString();
    };

    var toggleBtn = function ($btn, isEnable) {
        $btn.toggleClass('disabled', !isEnable);
        $btn.attr('disabled', !isEnable);
    };

    var showHighlightDialog = function ($editable, $dialog, text) {
        return $.Deferred(function (deferred) {
            var $highlightDialog = $dialog.find('.note-highlight-dialog');

            var $highlightCode = $highlightDialog.find('.note-highlight-code'),
                $highlightBtn = $highlightDialog.find('.note-highlight-btn'),
                $highlightSelect = $highlightDialog.find('.note-highlight-select');

            $highlightDialog.one('shown.bs.modal', function () {
                $highlightCode.val(text).on('input', function () {
                    toggleBtn($highlightBtn, $highlightCode.val());
                }).trigger('focus');

                $highlightBtn.click(function (event) {
                    event.preventDefault();
                    deferred.resolve($highlightCode.val(), $highlightSelect.val());
                    $highlightDialog.modal('hide');
                });
            }).one('hidden.bs.modal', function () {
                $highlightCode.off('input');
                $highlightBtn.off('click');

                if (deferred.state() === 'pending') {
                    deferred.reject();
                }
            }).modal('show');
        });
    };

    /**
     * @class plugin.highlight
     *
     * Code Highlight Plugin
     */
    $.summernote.addPlugin({
        /** @property {String} name name of plugin */
        name: 'highlight',
        /**
         * @property {Object} buttons
         * @property {Function} buttons.highlight   function to make button
         */
        buttons: { // buttons
            highlight: function (lang, options) {
                return tmpl.iconButton(options.iconPrefix + 'file-code-o', {
                    event: 'highlight',
                    title: lang.highlight.highlight,
                    hide: true
                });
            }
        },
        /**
         * @property {Object} dialogs
         * @property {function(object, object): string} dialogs.highlight
         */
        dialogs: {
            highlight: function (lang) {
                var body = '<div class="form-group">' +
                    '<select class="form-control note-highlight-select">' +
                    '<option value="apoll">apoll</option>' +
                    '<option value="basic">basic</option>' +
                    '<option value="clj">clj</option>' +
                    '<option value="coffee">coffee</option>' +
                    '<option value="css">css</option>' +
                    '<option value="dart">dart</option>' +
                    '<option value="erlan">erlan</option>' +
                    '<option value="go">go</option>' +
                    '<option value="hs">hs</option>' +
                    '<option value="htm">htm</option>' +
                    '<option value="html">html</option>' +
                    '<option value="java">java</option>' +
                    '<option value="js">js</option>' +
                    '<option value="lasso">lasso</option>' +
                    '<option value="lisp">lisp</option>' +
                    '<option value="llvm">llvm</option>' +
                    '<option value="logta">logta</option>' +
                    '<option value="lua">lua</option>' +
                    '<option value="matla">matla</option>' +
                    '<option value="ml">ml</option>' +
                    '<option value="mumps">mumps</option>' +
                    '<option value="n">n</option>' +
                    '<option value="pasca">pasca</option>' +
                    '<option value="perl">perl</option>' +
                    '<option value="php">php</option>' +
                    '<option value="proto">proto</option>' +
                    '<option value="py">py</option>' +
                    '<option value="r">r</option>' +
                    '<option value="rb">rb</option>' +
                    '<option value="rd">rd</option>' +
                    '<option value="rust">rust</option>' +
                    '<option value="scala">scala</option>' +
                    '<option value="sql">sql</option>' +
                    '<option value="swift">swift</option>' +
                    '<option value="tcl">tcl</option>' +
                    '<option value="tex">tex</option>' +
                    '<option value="vb">vb</option>' +
                    '<option value="vhdl">vhdl</option>' +
                    '<option value="wiki">wiki</option>' +
                    '<option value="xhtml">xhtml</option>' +
                    '<option value="xml">xml</option>' +
                    '<option value="xq">xq</option>' +
                    '<option value="yaml">yaml</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>' + lang.highlight.codeLabel + '</label>' +
                    '<textarea class="note-highlight-code form-control" rows="10"></textarea>' +
                    '</div>';
                var footer = '<button href="#" class="btn btn-primary note-highlight-btn disabled" disabled>' + lang.highlight.insert + '</button>';
                return tmpl.dialog('note-highlight-dialog', lang.highlight.insert, body, footer);
            }
        },

        /**
         * @property {Object} events
         * @property {Function} events.highlight  run function when button that has a 'highlight' event name  fires click
         */
        events: { // events
            highlight: function (event, editor, layoutInfo) {
                var $dialog = layoutInfo.dialog(),
                    $editable = layoutInfo.editable(),
                    text = getTextOnRange($editable);

                editor.saveRange($editable);
                showHighlightDialog($editable, $dialog, text).then(function (code, select) {
                    // when ok button clicked

                    // restore range
                    editor.restoreRange($editable);

                    // build node
                    var $node = createCodeNode(code, select);

                    if ($node) {
                        // insert code node
                        editor.insertNode($editable, $node);
                    }
                    //prettyPrint();
                }).fail(function () {
                    // when cancel button clicked
                    editor.restoreRange($editable);
                });
            }
        },
        // define language
        langs: {
            'en-US': {
                highlight: {
                    highlight: 'Insert code',
                    insert: 'Insert code',
                    codeLabel: 'Enter the code fragment'
                }
            },
            'ar-AR': {},
            'ca-ES': {},
            'cs-CZ': {},
            'da-DK': {},
            'de-DE': {},
            'es-ES': {},
            'es-EU': {},
            'fa-IR': {},
            'fi-FI': {},
            'fr-FR': {},
            'he-IL': {},
            'hu-HU': {},
            'id-ID': {},
            'it-IT': {},
            'ja-JP': {},
            'ko-KR': {},
            'nb-NO': {},
            'nl-NL': {},
            'pl-PL': {},
            'pt-BR': {},
            'ro-RO': {},
            'ru-RU': {},
            'sk-SK': {},
            'sl-SI': {},
            'sr-RS': {},
            'sr-RS-Latin': {},
            'sv-SE': {},
            'th-TH': {},
            'tr-TR': {
                highlight: {
                    highlight: 'Kod Ekle',
                    insert: 'Kodu Ekle',
                    codeLabel: 'Kod parçasını girin'
                }
            },
            'uk-UA': {},
            'vi-VN': {},
            'zh-CN': {
                highlight: {
                    highlight: '插入代码',
                    insert: '插入代码',
                    codeLabel: '输入代码片段'
                }
            },
            'zh-TW': {}
        }
    });
}));
