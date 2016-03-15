<?php

class Database {
    private $conn;
    private $host;
    private $name;
    private $username;
    private $password;
    
    public function __construct() {
        $this->host = DBHOST;
        $this->name = DBNAME;
        $this->username = DBUNAME;
        $this->password = DBPW;
        
        $this->conn = new PDO(DBSOCKET . $this->host . ';dbname=' . $this->name, $this->username, $this->password); 
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    }
    
    public function dbError($e){
        var_dump($e);
        //header("Location: " . HTML_PATH . 'index.php/error');
        //exit();
    }
    
    
    public function delete($where, $settings = null, $values = null){
        try{
            $stmt = $this->conn->prepare("DELETE FROM $where WHERE $settings");
            $stmt->execute($values);
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    /* Insert štandardný */
    public function insert($where, $what, $settings = null, $values = null){
        try{
            $stmt = $this->conn->prepare("INSERT INTO $where ($what) VALUES ($settings)");
            $stmt->execute($values);
            try{
                return $this->conn->lastInsertId();
            }catch (Exception $e){    
            }
            
        }  catch (Exception $e){
            dbError($e);
        }
    }
    
    /* Insert štandardný */
    public function insertMultiple($where, $what, $settings = null, $values = null){
        try{
            $stmt = $this->conn->prepare("INSERT INTO $where ($what) VALUES $settings");
            $stmt->execute($values);
            try{
                return $this->conn->lastInsertId();
            }catch (Exception $e){    
            }
            
        }  catch (Exception $e){
            dbError($e);
        }
    }
    
    
    /* Selectne čo treba a podla toho, či je vystup iba 1 row, alebo viac vyparsuje return */
    public function select($what, $from, $settings = "1", $values = null){
        try{
            $stmt = $this->conn->prepare("SELECT $what FROM $from WHERE $settings");
            $stmt->execute($values);
            if ($stmt->rowCount() == 1) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    /* Selectne čo treba a podla toho, či je vystup iba 1 row, alebo viac vyparsuje return */
    public function selectA($what, $from, $settings = "1", $values = null){
        try{
            $stmt = $this->conn->prepare("SELECT $what FROM $from WHERE $settings");
            $stmt->execute($values);
            
            if( $stmt->rowCount() > 0 ){
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return null;
            }
            
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    // Select aj s joinom
    public function selectJoin($what, $from, $joinTable, $joinCondition, $settings = "1", $values = null){
        try{
            $stmt = $this->conn->prepare("SELECT $what FROM $from INNER JOIN $joinTable ON $joinCondition WHERE $settings");
            $stmt->execute($values);
            if ($stmt->rowCount() == 1) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    // Select aj s joinom
    public function selectJoinA($what, $from, $joinTable, $joinCondition, $settings = "1", $values = null){
        try{
            $stmt = $this->conn->prepare("SELECT $what FROM $from INNER JOIN $joinTable ON $joinCondition WHERE $settings");
            $stmt->execute($values);
            
            if( $stmt->rowCount() > 0 ){
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return null;
            }
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    // skuska iba s fetchall,,, fetch vyzera ako blbost
    public function selectOuterJoin($what, $from, $joinTable, $joinCondition, $values = null){
        try{
            $stmt = $this->conn->prepare("SELECT $what FROM $from LEFT OUTER JOIN $joinTable ON $joinCondition");
            $stmt->execute($values);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    //vlastny select
    public function selfSelect($query,$values = null){
        try{
            $stmt = $this->conn->prepare($query);
            $stmt->execute($values);
            
            if( $stmt->rowCount() > 0 ){
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return null;
            }
            
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    public function update($table, $what, $settings = "1", $values = null){
        try{
            $stmt = $this->conn->prepare("UPDATE $table SET $what WHERE $settings");
            $stmt->execute($values);
            return $stmt;
        } catch (Exception $e){
            dbError($e);
        }
    }
    
    
    /* GETRE SETRE */
    function getConn() {
        return $this->conn;
    }


    
}
