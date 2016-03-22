<?php

namespace app\model;

class ProcessModel extends AbstractModel {
    private $connection;
    
    private $id;
    private $name;
    private $description;
    private $xml_file;
    private $created_by;
    private $created_date;
    
    private $processes = [];
    
     public function __construct() {
        $this->connection = \app\registry\Registry::singleton()->getObject("db");
    }
    
    
    // zistí, či už náhodou nieje vo firme tento istý proces
    public function checkDuplicateProcessesInFirm($firm_id, $process_id){
        $result = $this->connection->select("id","PN_X_FIRM","firm_id = ? AND pn_id = ? LIMIT 1", array($firm_id, $process_id));
        var_dum($result);
        
        if( empty( $result ) ){
            echo "preco";
            return false;
        } else {
            echo "lol";
            return true;
        }
    }
 
    
    // skontroluje, ci sedi hash, je to kvoli zabezpeceniu kopcenia procesu do nejakej firmy. 
    // Kedze v URL sa posielaju user_id a process_id treba zabezpecit aby ked niekto zmeni url, nezbehol script spravne
    public function checkUniqueProcessUserFirmHash($hash,$firm_salt,$process_id,$user_id){
        var_dum($hash);
        $newhash = hash("sha512", $firm_salt . $process_id . $user_id);
        var_dum($firm_salt);
        
        if( $hash == $newhash ){
            return true;
        } else {
            return false;
        }
    }
    
    
    // proces prekopíruje do firmy
    public function copyToFirm($firm_id,$process_id,$user_id){
        $result = $this->connection->select("id","petri_net"," id = ? AND created_by = ? LIMIT 1", array($process_id,$user_id));
        
        $copied = 0;
        if( empty($result) ) {
            $copied = 1;
        }
        return $this->connection->insert("PN_X_FIRM","firm_id, pn_id, created_by, copied, created_date","?,?,?,$copied,NOW()",array($firm_id, $process_id,$user_id));
    }
    
    // nakopírujee role procesu do firmy
    public function copyRolesToFirm($firm_id,$process_id){
        $result = $this->connection->selfSelect("SELECT ROLES.role_id FROM ROLES INNER JOIN TRANSITIONS_X_ROLE as TR ON TR.role_id = ROLES.role_id INNER JOIN transition ON    transition.id = TR.transition_id  INNER JOIN petri_net ON petri_net.id = transition.id_pn WHERE petri_net.id = ?", array($process_id));
        $resultIntersect = $this->connection->selectA("role_id","ROLES_X_FIRM","firm_id = ?", array( $firm_id ));
        
        foreach( $resultIntersect as $value ){ // toto dufam ze funguje
            $result = unsetFromMultiArray($result, "role_id", $value["role_id"]);
        }
        
        $string = [];
        for($i = 0; $i < count($result); $i++){
            $string[] = "( {$result[$i]['role_id']}, $firm_id )";
        }
        
        $string = implode(", ",$string);
        if( !empty($result) ){
            $this->connection->insertMultiple("ROLES_X_FIRM","role_id, firm_id",$string);
        }
    }
    

    // podľa parametrov vytvorí unique hash, ktorý sa vloží do URLky vo funkcii ProcessController/copyToFirm kde prave tento hash bude jeden z parametrov
    public function createUniqueProcessUserFirmHash($firm_salt,$process_id,$user_id){
        return hash("sha512", $firm_salt . $process_id . $user_id);
    }
    
    
    // nájde procesy buď všetky, alebo podľa patternu $letter a ešte zosortuje podľa atribútu $sort
    public function getAllProcesses($letter = null, $items_per_page = null, $sort = null, $page = null){
        
        if($items_per_page == null || $sort == null || $page == null){
            $result = $this->connection->selectOuterJoin("petri_net.id, name, petri_net.created_date, petri_net.created_by, COUNT(pn_id) as bla", "petri_net", "PN_X_FIRM", 'petri_net.id = PN_X_FIRM.pn_id WHERE petri_net.name LIKE "'. $letter .'%" GROUP BY petri_net.id');
            return $result;
        }
        $offset = ($page - 1) * $items_per_page;

        //SELECT petri_net.id, name, xml_file, COUNT(pn_id) AS bla FROM `petri_net` LEFT OUTER JOIN PN_X_FIRM ON petri_net.id = PN_X_FIRM.pn_id GROUP BY petri_net.id ORDER BY bla DESC
        switch($sort){
            case "1":
                echo "1";
                $result = $this->connection->selfSelect("SELECT * FROM
                (SELECT petri_net.id, name, petri_net.created_date, petri_net.created_by, COUNT(pn_id) as bla
                FROM petri_net LEFT OUTER JOIN PN_X_FIRM ON petri_net.id = PN_X_FIRM.pn_id " .
                'WHERE petri_net.name LIKE "'. $letter .'%" GROUP BY petri_net.id LIMIT ' . "$offset, $items_per_page) AS T1 ORDER BY T1.bla DESC");
                break;
            case "2":
                echo "2";
                $result = $this->connection->selfSelect("SELECT * FROM
                (SELECT petri_net.id, name, petri_net.created_date, petri_net.created_by, COUNT(pn_id) as bla
                FROM petri_net LEFT OUTER JOIN PN_X_FIRM ON petri_net.id = PN_X_FIRM.pn_id " .
                'WHERE petri_net.name LIKE "'. $letter .'%" GROUP BY petri_net.id LIMIT ' . "$offset, $items_per_page) AS T1 ORDER BY T1.created_date DESC");
                break;
            default:
                echo "3";
                $result = $this->connection->selfSelect("SELECT * FROM
                (SELECT petri_net.id, name, petri_net.created_date, petri_net.created_by, COUNT(pn_id) as bla
                FROM petri_net LEFT OUTER JOIN PN_X_FIRM ON petri_net.id = PN_X_FIRM.pn_id " .
                'WHERE petri_net.name LIKE "'. $letter .'%" GROUP BY petri_net.id LIMIT ' . "$offset, $items_per_page) AS T1 ORDER BY T1.id");
                break;
        }
            return $result;
        
    }
    
    
    // najlepšie procesy
    public function getBestProcesses($amount){
        $result = $this->connection->selectOuterJoin("P.id, P.name, P.description, P.created_date, COUNT(X.pn_id) as cnt","petri_net P", "PN_X_FIRM X","X.pn_id = P.id GROUP BY P.id ORDER BY cnt DESC LIMIT $amount");
        return $result;
    }
    
    
    // Podľa ID objednávky (PN_X_FIRM) najde a nastaví všetky potrebné atribúty. ||| Mozno iba kde je copied 1 je order
    public function getOrder($order_id){
        $result = $this->connection->select("*","PN_X_FIRM","id = ? LIMIT 1", array($order_id));
        return $result;
    }
    
    
    public function getUserOrders($user_id){
        $result = $this->connection->select("*","PN_X_FIRM","created_by = ? AND copied = 1", array($user_id));
        if( empty($result[0]) ){
            return false;
        } elseif ( !isset($result[0]) ) {
            return array($result);
        } else {
            return $result;
        }
    }
    

    // Podľa ID procesu najde a nastaví všetky potrebné atribúty. 
    public function getProcess($process_id){
        $result = $this->connection->selectA("*","petri_net","id = ? LIMIT 1", array($process_id));
        $this->setAll($result[0]["id"], $result[0]["name"], $result[0]["description"], $result[0]["xml_file"], $result[0]["created_by"], $result[0]["created_date"]);
        var_dum($process_id);
    }
    
    
    // podľa ID firmy nájde všetky procesy ||| neotestované po pridaní DESCRIPTION
    public function getProcessesByFirmId($firm_id){
        $result = $this->connection->selectJoin("petri_net.id, name, description, xml_file", "petri_net", "PN_X_FIRM", "petri_net.id = PN_X_FIRM.pn_id", "PN_X_FIRM.firm_id = ?", array($firm_id));
        
        if( !isset($result[0]) ){
            return array($result);
        } else {
            return $result;
        }
    }
    
    
    //moze byt deprecated, nakolko idem skusit urobit more general funkciu ||| neotestované po pridaní DESCRIPTION
    public function getProcessesByUserId($user_id){
        $result = $this->connection->selectA("id, name, description, xml_file","petri_net","created_by = ?", array($user_id));
        return $result;
    }
    
    
    /*public function test(){
        $firm_id = 1;
        $process_id = 4;
        $result = $this->connection->selfSelect("SELECT ROLES.role_id FROM ROLES INNER JOIN TRANSITIONS_X_ROLE as TR ON TR.role_id = ROLES.role_id INNER JOIN transition ON    transition.id = TR.transition_id  INNER JOIN petri_net ON petri_net.id = transition.id_pn WHERE petri_net.id = ?", array($process_id));
        
        $resultIntersect = $this->connection->selectA("role_id","ROLES_X_FIRM","firm_id = ?", array( $firm_id ));

        var_dum($result);
        return;
    }*/
    
    
    // nastaví všetky potrebné atribúty
    public function setAll($id, $name, $description, $xml_file, $created_by, $created_date, $processes = []){
        $this->setId($id);
        $this->setName($name);
        $this->setDescription($description);
        $this->setXml_file($xml_file);
        $this->setProcesses($processes);
        $this->created_by = $created_by;
        $this->created_date = $created_date;
    }
    
    
    // GETTRE SETTRE
    function getProcesses() {
        return $this->processes;
    }

    function setProcesses($processes) {
        $this->processes = $processes;
    }
    
    function getConnection() {
        return $this->connection;
    }

    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getXml_file() {
        return $this->xml_file;
    }
    
    function getDescription() {
        return $this->description;
    }

    function setDescription($description) {
        $this->description = $description;
    }

        function setConnection($connection) {
        $this->connection = $connection;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setXml_file($xml_file) {
        $this->xml_file = $xml_file;
    }
    
    function getCreated_by() {
        return $this->created_by;
    }

    function getCreated_date() {
        return $this->created_date;
    }

    function setCreated_by($created_by) {
        $this->created_by = $created_by;
    }

    function setCreated_date($created_date) {
        $this->created_date = $created_date;
    }


    
}
