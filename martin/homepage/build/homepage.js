(function(){
    function HomePage(){
        this.$el = $('body');
        this.preshow();
        this.show();
        this.postshow();
    };

    HomePage.prototype = Object.create({});
    HomePage.constructor = HomePage;

    //before data
    HomePage.prototype.preshow = function(){
        this.$el.append(Mustache.render(wm.__.templates.homepage,{}));
        addBanner.call(this);
        addMasthead.call(this);
        addCarousel.call(this);
        addCards.call(this);
    };

    //data
    HomePage.prototype.show = function(){

    };

    //after data
    HomePage.prototype.postshow = function(){
    };

    wm.__.Homepage = HomePage;

    function addBanner(){
        var content = {};
        content.bannertext = 'Vyskúšajte našu novinku - MARKET +';
        this.banner = $(Mustache.render(wm.__.templates.banner,content));
        this.$el.find('.banner').append(this.banner);
    }


    function addMasthead(){
        this.masthead = $(Mustache.render(wm.__.templates.masthead,{}));
        this.$el.find('.masthead').append(this.masthead);
    }

    function addCarousel(){
        this.quickregistration = $(Mustache.render(wm.__.templates.quickregistration,{}));
        this.$el.find('.carousel .container').append(this.quickregistration);


        var $processButton = this.$el.find('.drop-buttons').find('.process');
        var $firmButton = this.$el.find('.drop-buttons').find('.firm');

        var processContent = {
            "headerleft":"Podľa výberu alebo čo",
            "links":["Všetky procesy","Procesy s najviac case-mi","Najpoužívanejsie procesy"],
            "headerright":"Podľa abecedy",
            "alphabet":geterateCharArray(),
            "headerrightsearch":"Vyhľadávanie",
            "searchplaceholder":"Vyhľadaj kľúčové slovo"
        };

        var firmcontent = {
            "headerleft":"Podľa výberu alebo čo",
            "links":["Všetky firmy","Firmy s najviac case-mi","Najpoužívanejsie firmy"],
            "headerright":"Podľa abecedy",
            "alphabet":geterateCharArray(),
            "headerrightsearch":"Vyhľadávanie",
            "searchplaceholder":"Vyhľadaj kľúčové slovo"
        };

        var $processButtonDropcard = $(Mustache.render(wm.__.templates.dropcard,processContent));
        $processButton.append($processButtonDropcard);

        var $firmButtonDropcard = $(Mustache.render(wm.__.templates.dropcard,firmcontent));
        $firmButton.append($firmButtonDropcard);
    }

    function addCards(){
        var dataP = {
            "header":
                 "Vítr skoro nefouká a tak by se na první pohled mohlo zdát, že se balónky snad vůbec nepohybují. Jenom tak klidně levitují ve vzduchu. Jelikož slunce jasně září a na obloze byste od východu k západu hledali mráček marně, balónky působí jako jakási fata morgána uprostřed pouště. Zkrátka široko daleko nikde nic, jen zelenkavá tráva, jasně modrá obloha a tři křiklavě barevné pouťové balónky, které se téměř nepozorovatelně pohupují ",
            "description":
                "Jenže kvůli všudy přítomné trávě jsou stíny balónků sotva vidět, natož aby šlo rozeznat, jakou barvu tyto stíny mají. Uvidět tak balónky náhodný kolemjdoucí, jistě by si pomyslel, že už tu takhle poletují snad tisíc let. Stále si víceméně drží výšku a ani do stran se příliš nepohybují. Proti slunci to vypadá, že se slunce pohybuje k západu rychleji než balónky, a možná to tak skutečně je",
            "creatednumber":"77",
            "downloadnumber":"913",
            "price":"20,99"
        };
        $pCardList = this.$el.find(".process-list .card-list");

        for(var i=0;i<10;i++){
            var $card = $(Mustache.render(wm.__.templates.processcard,dataP));
            $pCardList.append($card);
        }

        //////////////////////////

        var dataF = {
            "header":
            "Když svítí slunce tak silně jako nyní, tak se stuha třpytí jako kapka rosy a jen málokdo vydrží dívat se",
            "description":
                "Kdyby pod balónky nebyla sytě zelenkavá tráva, ale třeba suchá silnice či beton, možná by bylo vidět jejich barevné stíny - to jak přes poloprůsvitné barevné balónky prochází ostré sluneční paprsky. Jenže kvůli všudy přítomné trávě jsou stíny balónků sotva vidět",
            "membercount":"128",
            "processcount":"42"
        };

        $fCardList = this.$el.find(".firm-list .card-list");
        for(var i=0;i<10;i++){
            var $fcard = $(Mustache.render(wm.__.templates.firmcard,dataF));
            $fCardList.append($fcard);
        }


    }

    function geterateCharArray(){
        var a = [],
            i = 'A'.charCodeAt(0),
            j = 'Z'.charCodeAt(0);

        for(;i<=j;++i){
            a.push(String.fromCharCode(i));
        }
        return a;
    }

})()