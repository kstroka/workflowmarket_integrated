<?php

namespace app\view;

abstract class AbstractView {
    const DEFAULT_HEADER = "header.php";
    const DEFAULT_CAROUSEL = "subCarousel.php";
    const DEFAULT_BODY = "body.php";
    const DEFAULT_BODYWRAP = SITE_PATH . 'template/' . "body.php";
    const DEFAULT_FOOTER = "footer.php";
    
    private $fields = array();
    private $header = self::DEFAULT_HEADER;
    private $carousel = self::DEFAULT_CAROUSEL;
    private $body = self::DEFAULT_BODY;
    private $bodywrap = self::DEFAULT_BODYWRAP;
    private $footer = self::DEFAULT_FOOTER;
    
    public function __construct($body,$carousel = self::DEFAULT_CAROUSEL, $header = self::DEFAULT_HEADER, $footer = self::DEFAULT_HEADER) {
        $this->header = SITE_PATH . 'template/' . $header;
        $this->carousel = SITE_PATH . 'template/carousel/' . $carousel;
        $this->body = SITE_PATH . 'template/pages/' . $body;
        $this->footer = SITE_PATH . 'template/' . $footer;
    }
    
    public function renderAll($fields){
        $this->fields = $fields;
       
        echo $this->render($this->header);
        echo $this->render($this->carousel);
        echo $this->render($this->bodywrap);
        echo $this->render($this->footer);
    }


    public function render($template) {
        extract($this->fields);

        ob_start();
        include( $template );
        return ob_get_clean();
    }
}
