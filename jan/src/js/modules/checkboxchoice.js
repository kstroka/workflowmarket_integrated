(function (_WMGlobal) {

    "use strict";

    function checkboxChoice(choice,id){
        this.init(choice,id);
        this.attachEventHandlers();
    }

    checkboxChoice.prototype.init = function (choice,id) {
        var context={choice:choice,id:id};
        this.$el = $(Mustache.render(_WMGlobal.templates.checkboxchoice,context));
    };

    checkboxChoice.prototype.attachEventHandlers = function () {
        this.$el.off('click').on('click',function(event){
            event.stopPropagation();
            event.preventDefault();
            //var $checkbox = $(event.target).closest('.checkbox-input-block');
            console.log(this.$el);
            switchCheckbox.call(this);
        }.bind(this));

    };

    checkboxChoice.prototype.setCheckboxValue = function (value) {
        var $label = this.$el.find('.label');
        var $input = this.$el.find('.checkbox-input');

        if(value === true) {
            if(!$label.hasClass('checked')){
                $label.addClass('checked');
            }
            $input.prop('checked', true);
        }else{
            if($label.hasClass('checked')){
                $label.removeClass('checked');
            }
            $input.prop('checked', false);
        }
    };


    function switchCheckbox(){

        var $label = this.$el.find('.label');
        var $input = this.$el.find('.checkbox-input');

        if($label.hasClass('checked')){
            $label.removeClass('checked');
            $label.find('.icon').removeClass('icon-tick').addClass('icon-cross');
            $input.prop('checked', false);
        }else{
            $label.addClass('checked');
            $label.find('.icon').removeClass('icon-cross').addClass('icon-tick');
            $input.prop('checked', true);
        }
    }

    _WMGlobal.checkboxChoice = checkboxChoice;

}(_WMGlobal))