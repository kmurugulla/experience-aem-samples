(function () {
    "use strict";

    if (typeof window.ExperienceAEM === "undefined") {
        window.ExperienceAEM = {};
    }

    if (typeof window.ExperienceAEM.TouchUI === "undefined") {
        window.ExperienceAEM.TouchUI = {};
    }

    var _ = window._, Class = window.Class, ExperienceAEM = window.ExperienceAEM;

    ExperienceAEM.TouchUI.Widget = new Class({
        toString: 'ExperienceAEM TouchUI Widget Base Class',
        EAEM_NESTED:  "eaem-nested",
        DATA_EAEM_NESTED:  "data-eaem-nested",
        CFFW:  ".coral-Form-fieldwrapper",
        JSON_STORE: "JSON_STORE",
        NODE_STORE: "NODE_STORE",

        isSelectOne: function ($field) {
            return !_.isEmpty($field) && ($field.prop("type") === "select-one");
        },

        setSelectOne: function ($field, value) {
            var select = $field.closest(".coral-Select").data("select");

            if (select) {
                select.setValue(value);
            }
        },

        isCheckbox: function ($field) {
            return !_.isEmpty($field) && ($field.prop("type") === "checkbox");
        },

        setCheckBox: function ($field, value) {
            $field.prop("checked", $field.attr("value") === value);
        },

        setWidgetValue: function ($field, value) {
            if (_.isEmpty($field)) {
                return;
            }

            if (this.isSelectOne($field)) {
                this.setSelectOne($field, value);
            } else if (this.isCheckbox($field)) {
                this.setCheckBox($field, value);
            } else {
                $field.val(value);
            }
        },

        isJsonStore: function(name){
            return (_.isEmpty(name) || name === this.JSON_STORE);
        },

        isNodeStore: function(name){
            return (name === this.NODE_STORE);
        }
    });
}());
