(function (_WMGlobal) {

    "use strict";

    var Dataset = {
      array : []
    };


    Dataset.addKey = function(type,key,value){

        if(!type){
            console.error('dataset add : not type provided');
            return -1;
        }

        if(!key){
            console.error('dataset add : not key provided');
            return -1;
        }

        var length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return -1
            }
        }

        this.array.push({"type" : type, "key" : key, "value" : value || ""});

        return this.array.length;
    };

    Dataset.getKey = function(key){
        if(!key){
            console.error('dataset get : key not provided');
            return -1;
        }

        var length = this.array.length;
        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return this.array[i];
            }
        }

        console.error('dataset get : not such a key');

    };

    Dataset.getDataset = function(){
        return this.array;
    };

    Dataset.setDataset = function(dataset){
        if(!dataset){
            console.error('dataset setDataset : not dataset provided');
            return -1;
        }

        this.array = dataset;
        return this.array.length;
    };

    Dataset.deleteDataset = function(){
        var length = this.array.length;
        return this.array.splice(0,length);
    };

    Dataset.removeKey = function(key){
        if(!key){
            console.error('dataset remove : key not provided');
            return -1;
        }

        var length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].key === key){
                return this.array.splice(i,1);
            }
        }

        console.error('dataset remove : not such a key in dataset');
    };

    Dataset.getTypeList = function (type) {

        if(!type){
            console.error('dataset getTypeList : type not provided');
            return -1;
        }

        var list = [],
            length = this.array.length;

        for(var i = 0; i < length; i++){
            if(this.array[i].type === type){
                list.push(this.array[i]);
            }
        }
        return list;
    };

    Dataset.loadFromLocalStorage = function(){

        var dataset = localStorage.getItem('dataset');
        if (dataset === null || dataset === undefined || dataset === "undefined") {
            return;
        } else {
            this.setDataset(JSON.parse(dataset));
        }
        //
        //console.log(dataset);
        //console.log(this.array);
    };

    Dataset.saveToLocalStorage = function(){
        localStorage.setItem("dataset",JSON.stringify(this.array));
    };

    _WMGlobal.dataset = Dataset;

}(_WMGlobal))