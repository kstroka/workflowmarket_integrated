(function (_WMGlobal) {
    "use strict";

    var _utils = {};

    _utils.getOnOffValue = function($el){
        if($el.hasClass('on-selected')){
            return true;
        }else{
            return false;
        }
    };

    _utils.attachAddToDatasetHandler = function ($el,type){
        $el.find('.dataset-add-icon').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');

            if($datasetEl.hasClass('shown')){
                $datasetEl.removeClass('shown');
                $datasetEl.stop().fadeOut(100);
                return;
            }

            $datasetEl.stop().fadeIn(200);
            $datasetEl.addClass('shown');
        });

        $el.find('.dataset-save-button').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');
            var $inputEl =  $target.closest('.block').find('.new-dataset');


            var newSelected = $inputEl.val().trim();
            if(newSelected === '' || _WMGlobal.addToDataset(type,newSelected) === false){
                $inputEl.focus();
                $inputEl.addClass('error');
                return;
            }


            $inputEl.removeClass('error');

            _WMGlobal.utilities.popupBuildSelectboxDataset($el,type);

            $el.find('.dataset').val(newSelected);
            $datasetEl.stop().fadeOut(100);
            $datasetEl.removeClass('shown');
            $target.closest('.block').find('.new-dataset').val('');
            _WMGlobal.saveData();
        });

        $el.find('.dataset-cancel-button').on('click',function(){
            var $target = $(this);
            var $datasetEl = $target.closest('.block').find('.add-dataset-block');

            $datasetEl.stop().fadeOut(100);
            $datasetEl.removeClass('shown');
            $target.closest('.block').find('.new-dataset').val('');

        })
    };

    _utils.popupBuildSelectboxDataset = function($el,type){

        var $select = $el.find('.dataset');
        $select.empty();
        $select.append($('<option selected value="undefined"> Select from dataset </option>'));

        //only dataset of selected type
        var dataset = _WMGlobal.getDatasetTypeList(type);
        //console.log(dataset);
        //console.log($select);
        //console.log(type);

        for(var data in dataset) {
            var $newOpt =   $('<option value="'+dataset[data].key+'">'+dataset[data].key+'</option>');
            $select.append($newOpt);
        }
    };

    _utils.attachOnOffHanlder = function($el){
        var $mov = $el.find('.mover');
        $mov.on('click',function(){
            var $target = $(this);
            var $description = $target.closest('.block').find('.description-block');

            if($target.hasClass('off-selected')) {
                $target.removeClass('off-selected');
                $target.addClass('on-selected');

                if($description.length !== 0){
                    $description.fadeIn(200);
                }
            }else{
                $target.removeClass('on-selected');
                $target.addClass('off-selected');

                if($description.length !== 0){
                    $description.fadeOut(100);
                    $description.find('.description').val('');
                    $description.find('.description').trigger('input');
                }
            }
        });
    };

    _utils.attachAddChoiceHandler = function($el){
        var $choices = $el.find('.choices');
        $choices.find('.add-choice-icon').off('click').on('click',function(){
            _utils.addChoice($el);
            $choices.trigger('choice:added');
        });
    };

    _utils.addChoice = function ($el){
        var $choices = $el.find('.choices');

        var choiceHTML =
            ' <div class="choice-block"> \
                <input type="text" class="choice"> \
                <div class="controls"> \
                    <div class="remove-choice-icon"> \
                    </div>\
                </div>\
            </div> \ ';
        var $choice = $(choiceHTML);
        var $last = $choices.find('.choice-block:last');
        _utils.attachRemoveChoiceHandler($choice,$el);
        _utils.attachChangeChoiceHandler($choice,$el);
        $choice.css('display','none');
        $choice.insertBefore($last);
        $choice.fadeIn(200);

        return $choice;
    };

    _utils.loadChoices = function($el,data){
        var $choices = $el.find('.choices');
        if(data === undefined){
            return;
        }

        //make a copy od data
        var choicesdata = data.slice();

        $choices.find('.choice').val(choicesdata.pop());

        while(choicesdata.length > 0){
            _utils.addChoice($el).find('.choice').val(choicesdata.shift());
        }

    };

    _utils.getChoices = function($el){
        var list = [];
        $el.find('.choices').find('.choice').each(function(){
            var $choice = $(this);
            if($choice.val().trim() !== '' && $choice.val().trim() !== undefined ){
                list.push($choice.val().trim());
            }
        });

        return list;
    };

    _utils.attachRemoveChoiceHandler = function($choice,$el){
        var $choices = $el.find('.choices');

        $choice.find('.remove-choice-icon').on('click',function(event){
            $choice.fadeOut(100,function(){
                $choice.remove();
                $choices.trigger('choice:removed');
            });
        })
    };

    _utils.attachChangeChoiceHandler = function($choice,$el){
        var $choices = $el.find('.choices');

        $choice.find('.choice').on('input',function(event){
            $choices.trigger('choice:changed');
        })
    };

    _utils.noChoiceHanlder = function($el,empty){
        var error = $el.find('.choices').find('.error');
        var choices =  $el.find('.choices').find('.choice');
        var $first = choices.first();
        if(empty){
            if(error.length === 0){
                $first.addClass('error');
            }

            $first.focus();
            return false;
        }
        error.removeClass('error');
        return true;
    };

    _utils.setOnOffValue = function($el,status){

        if(status === true){
            $el.removeClass('off-selected').addClass('on-selected');
        } else {
            $el.removeClass('on-selected').addClass('off-selected');
        }
    };

    _utils.attachBasicPreviewHandlers = function($popup){
        var $preview = $popup.find('.preview');
        var $toolbar = $popup.find('.toolbar-editor');
        var $previewBlock = $preview.find('.preview-block');

        $toolbar.find('input.fieldname[type=text]').on('input',function(event){
            if($(event.target).val().trim() === '' || $(event.target).val().trim() === undefined){
                $previewBlock.css('visibility','hidden');
                return;
            }

            $previewBlock.css('visibility','visible');
            $preview.find('.fieldname').text($(event.target).val().trim());
        });

        $toolbar.find('.description-block').find(".description").on('input change',function(event){
            $preview.find('.description').text($(event.target).val().trim());
        });

    };


    _WMGlobal.utilities = _utils;
}(_WMGlobal))