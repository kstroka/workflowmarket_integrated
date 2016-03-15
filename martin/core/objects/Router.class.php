<?php

class Router {
    const DEFAULT_CONTROLLER = "IndexController";
    const DEFAULT_ACTION = "index";

    protected $controller = self::DEFAULT_CONTROLLER;
    protected $action = self::DEFAULT_ACTION;
    protected $params = array();
    protected $basePath = ROUTER_BASE;

    public function __construct(/*array $options = array()*/) {

       /* if (empty($options)) {*/
            $this->parseUri();
        /*}*/
        /*else {
            if (isset($options["controller"])) {
                $this->setController($options["controller"]);
            }
            if (isset($options["action"])) {
                $this->setAction($options["action"]);
            }
            if (isset($options["params"])) {
                $this->setParams($options["params"]);
            }
        }*/
    }

    
    protected function parseUri() {
        $path = trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/");

        if (strpos($path, $this->basePath) === 0) {
            $path = substr($path, strlen($this->basePath));
        }
        else{
            $path = "Index";
        }
        
        list($controller, $action, $params) = explode("/", $path, 3);

        if (isset($controller)) {
             $this->setController($controller);
        }
        if (isset($action)) {
            $this->setAction($action);
        }
        if (isset($params)) {
            $this->setParams(explode("/", $params));
        }
    }

    
    public function setController($controller) {
        $controller = ucfirst(strtolower($controller)) . "Controller";
        $string = '\app\controller\\' . $controller;
        //$skuska = new $string;

        //require_once(SITE_PATH . "controller/$controller.class.php");

        if (!class_exists($string)) {
            //header("Location: " . HTML_PATH . 'index.php/error');
            //exit();
            throw new InvalidArgumentException("Neexistuje controller");
        }
        $this->controller = $controller;
        return $this;
    }

    
    public function setAction($action) {
        $reflector = new ReflectionClass("\app\controller\\" . $this->controller); 
        
        if (!$reflector->hasMethod($action)) {
            //header("Location: " . HTML_PATH . 'index.php/error');
            //exit();
            throw new InvalidArgumentException("Neexistuje metoda");
        }
        $this->action = $action;
        return $this;
    }

    
    public function setParams(array $params) {
        $this->params = $params;
        return $this;
    }

    
    public function run() {
        $string = '\app\controller\\' . $this->controller;
        $cont = new $string;
        //$cont = new $this->controller($this->site_path, $this->html_path, $this->connection);
        call_user_func_array(array($cont, $this->action), $this->params);
    }
}

