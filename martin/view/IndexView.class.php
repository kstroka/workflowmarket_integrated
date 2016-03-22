<?php namespace app\view;

class IndexView {
    const DEFAULT_TEMPLATE = "template.tpl.php";
    const DEFAULT_BODY = "template.tpl.php";
    
    private $template = self::DEFAULT_TEMPLATE;
    private $fields = array();
    private $header;
    private $body;
    private $footer;
    
    public function render($template, $fields) {
            
        $this->template = $template;
        $this->fields = $fields;
        
        extract($this->fields);
        ob_start();
        include( SITE_PATH . 'template/' . $this->template );
        return ob_get_clean();
    }
}
