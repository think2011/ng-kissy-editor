/*
 <link rel="stylesheet" type="text/css" href="http://g.tbcdn.cn/kg/editor-plugins/1.1.2/assets/editor.css">
 <script src="//g.alicdn.com/kissy/k/5.0.1/seed.js" data-config="{combine:false}"></script>
 <script src="http://g.tbcdn.cn/kg/editor-plugins/1.1.3/mods.js"></script>
 */

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
        "!zy-img-selector",
        "separator",
        "bold",
        "italic",
        "font-family",
        "font-size",
        "strike-through",
        "underline",
        "separator",
        "checkbox-source-area",
        "link",
        "fore-color",
        "back-color",
        //"resize",
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
        "flash"
    ];

    var pluginsConfig = {};

    var fullPlugins = plugins.map(function (v) {
        return v[0] === '!' ? v : 'kg/editor-plugins/1.1.3/' + v;
    });


    angular.module('ng-editor', [])
        .directive('editor', function ($timeout, $interval) {
            return {
                restrict  : 'EA',
                replace   : true,
                transclude: true,
                scope     : {
                    initModel: '=',
                    model    : '='
                },
                template  : '<textarea></textarea>',
                link      : linkFn
            };

            function linkFn(scope, element, attrs) {
                var interVal = null;
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
                        // init
                        if (scope.initModel) {
                            editor.setData(scope.initModel + '');
                        }

                        // model to view
                        scope.$watch('initModel', function (newVal, oldVal) {
                            newVal && editor.setData(newVal + '');
                        });

                        // view to model
                        interVal = $interval(function () {
                            scope.model = editor.getData();
                        }, 300);
                    });
                });

                scope.$on('$destroy', function () {
                    $interval.cancel(interVal);
                });
            }
        });
})();
