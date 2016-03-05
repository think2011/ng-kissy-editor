(function () {
    require.config({
        packages: [
            {
                name: 'kg',
                base: 'http://g.tbcdn.cn/kg/'
            }
        ]
    });

    var plugins = [
        "source-area",
        /*   "separator",
         "bold",
         "italic",
         "font-family",
         "font-size",
         "strike-through",
         "underline",
         "separator",
         "checkbox-source-area",
         "!zy-img-selector",
         "link",
         "fore-color",
         "back-color",
         "resize",
         "draft",
         "undo",
         "indent",
         "outdent",
         "unordered-list",
         "ordered-list",
         "element-path",
         "page-break",
         "preview",
         "maximize",
         "remove-format",
         "heading",
         "justify-left",
         "justify-center",
         "justify-right",
         "table",
         "smiley",
         "flash"*/
    ];

    var pluginsConfig = {};

    var fullPlugins = plugins.map(function (v) {
        return v[0] === '!' ? v : 'kg/editor-plugins/1.1.3/' + v;
    });


    angular.module('editor', [])
        .directive('editor', function ($timeout) {
            return {
                restrict  : 'EA',
                replace   : true,
                transclude: true,
                scope     : {
                    model: '='
                },
                template  : '<textarea></textarea>',
                link      : linkFn
            };

            function linkFn(scope, element, attrs) {
                var editorId = 'editor-' + Date.now();
                element.attr('id', editorId).css('visibility', 'hidden');

                require(['editor'].concat(fullPlugins), function (Editor) {
                    var args = [].slice.call(arguments);
                    args.splice(0, 1);

                    args.forEach(function (arg, k) {
                        var argStr = plugins[k];

                        // 适应有传入配置的插件
                        if (pluginsConfig[argStr]) args[k] = new arg(pluginsConfig[argStr]);
                    });

                    var editor = Editor.decorate('#' + editorId, {
                        focused: true,
                        plugins: args
                    });

                    $timeout(function () {
                        // model to view
                        scope.$watch('model', function (newVal) {
                            newVal && editor.setData(newVal + '');
                        });


                        // view to model
                        editor.on('blur', function (e) {
                            console.log(editor.getData());
                            scope.model = editor.getData();
                            scope.$apply();
                        });
                    });

                });
            }
        });
})();
