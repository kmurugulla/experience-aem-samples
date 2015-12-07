(function ($, $document) {
    "use strict";

    var _ = window._, Class = window.Class, ExperienceAEM = window.ExperienceAEM;

    ExperienceAEM.TouchUI.NodeCompositeMultiField = new Class({
        toString: 'ExperienceAEM TouchUI Composite Multifield Store as Nodes',
        extend: ExperienceAEM.TouchUI.Widget,

        getMultiFieldNames: function(){
            var cmf = this, mNames = {}, mName, $multifield, $template,
                $multiTemplates = $(".js-coral-Multifield-input-template");

            $multiTemplates.each(function (i, template) {
                $template = $(template);
                $multifield = $($template.html());

                if(!cmf.isNodeStore($multifield.data(cmf.EAEM_NESTED))){
                    return;
                }

                mName = $multifield.data("name").substring(2);

                mNames[mName] = $template.closest(".coral-Multifield");
            });

            return mNames;
        },

        buildMultiField: function(data, $multifield, mName){
            var cmf = this;

            if(_.isEmpty(mName) || _.isEmpty(data)){
                return;
            }

            _.each(data, function(value, key){
                if(key === "jcr:primaryType"){
                    return;
                }

                $multifield.find(".js-coral-Multifield-add").click();

                _.each(value, function(fValue, fKey){
                    if(fKey === "jcr:primaryType"){
                        return;
                    }

                    var $field = $multifield.find("[name='./" + fKey + "']").last();

                    if(_.isEmpty($field)){
                        return;
                    }

                    cmf.setWidgetValue($field, fValue);
                });
            });
        },

        addDataInFields: function () {
            var cmf = this, mNames = cmf.getMultiFieldNames(),
                $form = $("form.cq-dialog"),
                actionUrl = $form.attr("action") + ".infinity.json";

            function postProcess(data){
                _.each(mNames, function($multifield, mName){
                    cmf.buildMultiField(data[mName], $multifield, mName);
                });
            }

            $.ajax(actionUrl).done(postProcess);
        },

        getNodeStoreMultifields: function(){
            return $("[" + this.DATA_EAEM_NESTED + "='" + this.NODE_STORE + "']");
        },

        collectDataFromFields: function(){
            var $multifields = this.getNodeStoreMultifields(),
                $form = $("form.cq-dialog"), $fields, cmf = this;

            if(_.isEmpty($multifields)){
                return;
            }

            function fillValue($form, fieldSetName, $field, counter){
                var name = $field.attr("name"), value;

                if (!name) {
                    return;
                }

                //strip ./
                if (name.indexOf("./") === 0) {
                    name = name.substring(2);
                }

                value = $field.val();

                if (cmf.isCheckbox($field)) {
                    value = $field.prop("checked") ? $field.val() : "";
                }

                //remove the field, so that individual values are not POSTed
                $field.remove();

                $('<input />').attr('type', 'hidden')
                    .attr('name', fieldSetName + "/" + counter + "/" + name)
                    .attr('value', value)
                    .appendTo($form);
            }

            $multifields.each(function(counter, multifield){
                $fields = $(multifield).children().children(cmf.CFFW);

                $fields.each(function (j, field) {
                    fillValue($form, $(multifield).data("name"), $(field).find("[name]"), (counter + 1));
                });
            });
        }
    });

    $document.ready(function () {
        var compositeMultiField = new ExperienceAEM.TouchUI.NodeCompositeMultiField();

        $document.on("dialog-ready", function(){
            compositeMultiField.addDataInFields();
        });

        $document.on("click", ".cq-dialog-submit", function(){
            compositeMultiField.collectDataFromFields();
        });
    });
}(jQuery, jQuery(document)));
