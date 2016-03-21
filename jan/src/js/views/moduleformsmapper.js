(function (_WMGlobal) {
"use strict";

    var _fm = {
        $el : {}
    };

    _fm.attachEvents = function () {

        $(document).off('click').on('click',function(event){

            if( (Object.keys(_WMGlobal.formSelector.$el).length !== 0)){
                if(_WMGlobal.formSelector.$el.has( $(event.target) ).length === 0 && _WMGlobal.formSelector.$el.hasClass('opened')){
                    _WMGlobal.formSelector.destroySelector();
                }
            }
        });

        _fm.$el.find(".transition").add(".transition-icon").on('click',function(event){
            var transitionID = $(event.target).attr('id');

            if(_WMGlobal.mapping.hasForm(transitionID)) {

            }else{
                _WMGlobal.formSelector.init(transitionID);
                return;
            }

        });

        _fm.$el.find(".close-button").on('click', function (event) {
            _WMGlobal.sendFormsJSON();
        });
    };

    _fm.init = function(){
        _fm.showPetriNet();
        _fm.addControls();
        _fm.attachEvents();
    };

    _fm.showPetriNet = function(){
        _fm.$el = $(petrinetHTML);

        addIconsToMapped();

        _WMGlobal.$el.append(_fm.$el);
        _fm.$el.show();
    };

    _fm.destroyMapper = function(){
        _fm.$el.hide(0,function(){
            _fm.$el.remove();
            _fm.$el = {};
        });

    };


    _fm.createNewMapping = function(transitionID, formID){

        _WMGlobal.mapping.addMapping(transitionID,formID);
        _WMGlobal.saveData();
    };


    _fm.removeFromMapping = function(formID,transitionID){
        var removed =  _WMGlobal.mapping.removeMappingByFormID(formID);
        if(removed){
            removeIcon(transitionID);
        }
        return removed;
    };

    _fm.addControls = function(){

        var parent = _fm.$el.find('svg');
        var mapped = _WMGlobal.mapping.getMappedTransitions();

        var length = mapped.length;
        for(var i = 0; i < length; i++){
            var transition = parent.find('.transition[id="'+mapped[i]+'"]');
            var icon = parent.find('image[id="'+mapped[i]+'"]');
            var form = _WMGlobal.getFormById(_WMGlobal.mapping.getFormID(transition.attr('id')));
            if(form){
                var control = new  _WMGlobal.formControls(_fm.$el,transition.add(icon),form);
            }
        }

    };

    function addIconsToMapped(){
        var parent = _fm.$el.find('svg');
        var mapped = _WMGlobal.mapping.getMappedTransitions();
        var length = mapped.length;
        for(var i = 0; i < length; i++){
            var transition = parent.find('.transition[id="'+mapped[i]+'"]');
            addIcon(parent,transition);
        }
    }

    function addIcon(parent,transition){

        var transitionID = transition.attr('id');
        var width = parseInt(transition.attr('width')) - 10;
        var height = parseInt(transition.attr('height')) - 10;
        var x = parseInt(transition.attr('x')) + 5;
        var y = parseInt(transition.attr('y')) + 5;

        var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','height',height);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','width',width);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','x',x);
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','y',y);
        svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','./build/content/svg/form.svg');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','class','transition-icon');
        svgimg.setAttributeNS('http://www.w3.org/2000/svg','id',transitionID);

        parent.append(svgimg);
        parent.html(parent.html());
    }

    function removeIcon(transitionID){
        var parent = _fm.$el.find('svg');
        var icon = parent.find('image[id="'+transitionID+'"]');
        icon.remove();
    }


    var petrinetHTML =
        '<div class="formMapper"> \
            <svg width="800" height="500"> \
                 <circle id="0" cx="231" cy="182" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="226.5" y="185.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">8</text>\
                 <rect id="1" x="336" y="68" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <rect id="2" x="307" y="248" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <rect id="3" x="592" y="166" width="40" height="40" fill="white" class="transition" stroke="green" stroke-width="2"></rect>\
                 <circle id="4" cx="448" cy="184" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="443.5" y="187.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">1</text>\
                 <circle id="5" cx="769" cy="181" r="20" fill="white" stroke="black" stroke-width="2" class="place"></circle>\
                 <text x="764.5" y="184.75" font-family="verdana" font-weight="bold" font-size="12" fill="black">1</text>\
                 <polyline points="246.9846416619502,169.97954947021344 328.00767916902487,109.05022526489327" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="336,103.04 331.01279180147156,113.04638568038084 325.0025665365783,105.05406484940573" stroke="black" fill="black"></polygon>\
                 <rect x="290.49232083097513" y="139.50977473510673" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect>\
                 <text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="245.89670671446117,195.3449664317048 299.5516466427694,243.41085011748095" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="307,250.08333333333334 296.21540503484323,247.13502679609624 302.8878882506956,239.68667343886565" stroke="black" fill="black"></polygon>\
                 <rect x="275.4483533572306" y="225.71414988251905" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="375.1666666666667,108 427.24283910293155,162.34035384653728" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="434.1618927352877,169.5602358976915 423.6328980773544,165.79988066271537 430.8527801285087,158.8808270303592" stroke="black" fill="black"></polygon>\
                 <rect x="403.6642797009772" y="141.78011794884577" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="347,254.11570247933884 423.3562507872838,201.1080573046956" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="431.5708338581892,195.40537153646372 426.2075936713997,205.21534884014827 420.50490790316786,197.00076576924286" stroke="black" fill="black"></polygon>\
                 <rect x="388.2854169290946" y="227.7605370079013" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="467.9985129558699,184.24388430433987 582.000743522065,185.63415540880567" fill="none" stroke-width="2" stroke="black"></polyline><polygon points="592,185.7560975609756 581.93977244598,190.63378364777316 582.06171459815,180.63452716983818" stroke="black" fill="black"></polygon>\
                 <rect x="528.999256477935" y="187.99999093265774" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect><text font-family="verdana" font-weight="bold" font-size="12"></text>\
                 <polyline points="632,185.36305732484075 739.015202036022,181.95492987146426" fill="none" stroke-width="2" stroke="black"></polyline>\
                 <polygon points="749.0101346906813,181.6366199143095 739.1743570145993,186.95239619879393 738.8560470574446,176.95746354413458" stroke="black" fill="black"></polygon><rect x="689.5050673453406" y="186.49983861957514" stroke="black" stroke-width="1" fill="white" width="2" height="0"></rect>\
                 <text font-family="verdana" font-weight="bold" font-size="12"></text>\
             </svg> \
            <div class="close-mapper"> \
                <div class="close-button">Log data </div> \
            </div> \
        </div>';

    var transitionPop =
        '<div class="transition-controlls"  data-id=""> \
            <div class="close-controlls"><div class="icon-close"></div></div>\
            <div class="action-selector">\
                <div class="headline"></div> \
                <div class="edit-form">\
                    <div class="icon-add"></div>\
                    <div class="label">Edit</div>\
                </div>\
                <div class="change-form"><div class="icon-test1"></div><div class="label">Rename</div></div>\
                <div class="remove-form"><div class="icon-close"></div><div class="label">Remove</div></div> \
            </div>\
            \
            <div class="remove-form-confirm" >\
                <div class="headline"></div> \
                <div class="question">Are you sure you want to remove this form from transition ?</div>\
                <div class="cancel">Cancel</div>\
                <div class="remove">Remove</div>\
            </div>\
            \
            <div class="change-form-name-confirm">\
                <div class="headline">Rename form</div> \
                <input class="form-name" value="Example of name">\
                <div class="cancel">Cancel</div>\
                <div class="save">Save</div>\
            </div>\
            \
        </div>\ ' ;




    _WMGlobal.formMapper = _fm;


}(_WMGlobal))