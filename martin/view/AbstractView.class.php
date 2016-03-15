<?php

namespace app\view;

abstract class AbstractView {
    const DEFAULT_HEADER = "header.php";
    const DEFAULT_BODY = "body.php";
    const DEFAULT_BODYWRAP = SITE_PATH . 'template/' . "body.php";
    const DEFAULT_FOOTER = "footer.php";
    
    private $fields = array();
    private $header = self::DEFAULT_HEADER;
    private $body = self::DEFAULT_BODY;
    private $bodywrap = self::DEFAULT_BODYWRAP;
    private $footer = self::DEFAULT_FOOTER;
    
    public function __construct($body,$header = self::DEFAULT_HEADER, $footer = self::DEFAULT_HEADER) {
        $this->header = SITE_PATH . 'template/' . $header;
        $this->body = SITE_PATH . 'template/pages/' . $body;
        $this->footer = SITE_PATH . 'template/' . $footer;
    }
    
    public function renderAll($fields){
        $this->fields = $fields;
       
        echo $this->render($this->header);
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
