(function (_WMGlobal) {

    "use strict";

    function formControls($parent,$transitionEl,form){
        this.init($parent,$transitionEl,form);
        this.attachEventHandlers.call(this);

    }

    formControls.prototype.init = function($parent,$transitionEl,form){
        if(!$parent){
            console.error('formControls init : not $parent provided');
            return;
        }

        if(!$transitionEl){
            console.error('formControls init : not $transitionEl provided');
            return;
        }

        
        this.$parent = $parent;
        this.$transition = $transitionEl;
        this.form = form;

        this.id = $transitionEl.attr('id') || $transitionEl.attr('data-id');

        var context = {
            id : this.id,
            formname : this.form.name
        };

        this.$el = $(Mustache.render(_WMGlobal.templates.mappingcontrols,context));
        
        this.$el.css('top',this.$transition.position().top - 132);
        this.$el.css('left',this.$transition.position().left -120 + 20);

        this.$menu = this.$el.find('.action-selector');
        this.$remove = this.$el.find('.remove-form-confirm');
        this.$rename = this.$el.find('.change-form-name-confirm');

        this.$editIcon = this.$el.find('.edit-form');
        this.$renameIcon = this.$el.find('.change-form');
        this.$removeIcon = this.$el.find('.remove-form');

        this.$parent.append(this.$el);

    };


    formControls.prototype.attachEventHandlers = function(){

        this.$transition.on('click',function(){openControls.call(this)}.bind(this));

        this.$el.find('.close-controlls').on('click',function(){closeControls.call(this)}.bind(this));

        this.$editIcon.on('click',function(){openEdit.call(this)}.bind(this));

        this.$renameIcon.on('click',function(){openRename.call(this)}.bind(this));

        this.$removeIcon.on('click',function(){openRemove.call(this)}.bind(this));

        this.$rename.find('.cancel').on('click',function(){cancelRename.call(this)}.bind(this));

        this.$remove.find('.cancel').on('click',function(){cancelRemove.call(this)}.bind(this));

        this.$rename.find('.save').on('click',function(){confirmRename.call(this)}.bind(this));

        this.$remove.find('.remove').on('click',function(){confirmRemove.call(this)}.bind(this));

        $(document).on('click',function (event) {
            event.stopPropagation();
            event.preventDefault();

            if(this.$el.has( $(event.target) ).length === 0 &&
                $(event.target).closest('.transition-icon,.transition').length === 0){

                closeControls.call(this);
            }
        }.bind(this));

        $(document).on('closeControls',function () {
            closeControls.call(this);
        }.bind(this))
    };

    function closeControls(){
        this.$el.fadeOut(100);
    }

    function openEdit(){
        _WMGlobal.formMapper.destroyMapper();
        _WMGlobal.formCreator.init(this.form);
    }

    function openControls(){
        var $visible = $('.transition-controlls:visible');
        if($visible.length > 0){
            $visible.each(function() {
                $( this ).hide();
            });
        }
        this.$el.show();
    }

    function  openRename(){
        this.$menu.hide(0,function(){
            this.$rename.find('.form-name').val(this.form.name);
            this.$rename.show();
            this.$rename.find('input').focus();
        }.call(this));
    }

    function openRemove(){
        this.$menu.hide(0,function(){
            this.$remove.find('.headline').val(this.form.name);
            this.$remove.show();
        }.call(this));
    }

    function cancelRename(){
        this.$rename.hide(0,function(){
            this.$menu.find('.headline').val(this.form.name);
            this.$menu.show();
        }.call(this));
    }

    function cancelRemove(){
        this.$remove.hide(0,function(){
            this.$menu.find('.headline').val(this.form.name);
            this.$menu.show();
        }.call(this));

    }

    function confirmRename(){
        this.$rename.hide(0,function(){
            var newname = this.$rename.find('.form-name').val();
            this.form.name = newname;
            this.$menu.find('.headline').text(newname);
            this.$menu.show();
            _WMGlobal.saveData();
        }.call(this));
    }

    function confirmRemove(){
        this.$remove.hide(100,function(){
            _WMGlobal.formMapper.removeFromMapping(this.form.id,this.id);
            this.$el.remove();
            _WMGlobal.saveData();
            _WMGlobal.saveData();
        }.call(this));
    }


    _WMGlobal.formControls = formControls;

}(_WMGlobal))