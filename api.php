<?php

include_once("/Diseases/branch_api.php");

class API {

    private $method;
    private $requestURL;

    public function __construct($request) {
        $this->requestURL = split('[/]', $request);
        $this->method = $_SERVER['REQUEST_METHOD'];
    }

    function processAPI() {
        if(length($this->method) == 1) {
            echo("here");
            if($this->method[0] == "users") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {
                    echo("here");
                    //do_a_test();
                } else if($_SERVER['REQUEST_METHOD'] == "POST") {

                }
            } else if($this->method[0] == "diseases") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                }
            } else if($this->method[0] == "trends") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                }
            }
        } else if(length($this->method) == 2) {
            if($this->method[0] == "users") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                } else if($_SERVER['REQUEST_METHOD'] == "PUT") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "DELETE") {
                    
                }
            } else if($this->method[0] == "diseases") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                }
            } else if($this->method[0] == "trends") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                }
            }
        } else if(length($this->method) == 3) {
            if($this->method[0] == "diseases" && $this->method[2] == "symptoms") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {

                }
            } else if($this->method[0] == "users" && $this->method[2] == "diseases") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "PATCH") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "POST") {
                    
                }
            } else if($this->method[0] == "users" && $this->method[2] == "symptoms") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "POST") {
                    
                }
            }
        } else if(length($this->method) == 4) {
            if($this->method[0] == "users" && $this->method[2] == "diseases") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "DELETE") {
                    
                }
            }
        } else if(length($this->method) == 5) {
            if($this->method[0] == "users" && $this->method[2] == "diseases" && $this->method[4] == "symptoms") {
                if($_SERVER['REQUEST_METHOD'] == "GET") {
                    
                }
            }
        } else if(length($this->method) == 6) {
            if($this->method[0] == "users" && $this->method[2] == "diseases" && $this->method[4] == "symptoms") {
                if($_SERVER['REQUEST_METHOD'] == "DELETE") {
                    
                } else if($_SERVER['REQUEST_METHOD'] == "GET") {
                    
                }
            }
        }
    }

 }

try {
    $API = new API($_REQUEST['request']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}


?>