<?php
require_once("rest.inc.php");

include "db.php";

class API extends REST {

	public $data = "";

	private $db = NULL;
	private $mysqli = NULL;
	public function __construct(){
		parent::__construct(); // Init parent contructor
		$this->dbConnect(); // Initiate Database connection
	}

/*
* Connect to Database
*/
private function dbConnect(){
	$this->mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB);
	$this->mysqli->set_charset("utf8");
}

/*
* Dynmically call the method based on the query string
*/
public function processApi(){
	$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
	if((int)method_exists($this,$func) > 0)
		$this->$func();
	else
		$this->response('',404); // If the method not exist with in this class "Page not found".
}

//editions
function getEditions() {
	$postdata = file_get_contents("php://input");
	$toReturn = array();
	$sql = "SELECT id, number, name, start_date, stop_date FROM event_editions WHERE visibility=1 ORDER BY number DESC";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {			
			$toReturn[] = array('id' => $row["id"], 'number' => $row["number"], 'name' => $row["name"], 'start_date' => $row["start_date"], 'stop_date' => $row["stop_date"]);
		}
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
} 

function getDescription() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT id, content FROM description WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_assoc($result);
		$toReturn = array('content' => $row["content"]);
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getTrainers() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT * FROM trainers WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {	
			$photo = '';	
			if ($row["photo"] != '') {
				$photo = 'cms/' . $row["photo"];
			}					
			$toReturn[] = array('id' => $row["id"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'description' => $row["description"], 'experience' => $row["experience"], 'photo' => $photo);
		}
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getAgenda() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT a.id, name, a.description, start_date, start_time, stop_date, stop_time, trainer_id, t.first_name, t.last_name FROM agenda a JOIN trainers t ON trainer_id = t.id WHERE a.event_edition='$edition' ORDER BY start_date ASC, start_time ASC";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {					
			$toReturn[] = array('id' => $row["id"], 'text' => $row["name"], 'start' => $row["start_date"] . 'T' . $row["start_time"], 'end' => $row["stop_date"] . 'T' . $row["stop_time"], 'description' => $row["description"], 'trainer_id' => $row["trainer_id"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"]);
		}
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getPartners() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$partnerList = array();
	@$edition = $request->edition;
	$sql = "SELECT id, name FROM partners_dictionary WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	$partners = array();
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$id = $row["id"];
			$sql = "SELECT id, name, description, www, logo, fb,  logo FROM partners WHERE type_id = $id AND event_edition='$edition'";	
			$resultPartner = $this->mysqli->query($sql);
			$partnerList = null;
			if ($resultPartner) {
				if (mysqli_num_rows($resultPartner) > 0) {
					while($rowPartner = mysqli_fetch_assoc($resultPartner)) {	
						$logo = '';	
						if ($rowPartner["logo"] != '') {
							$logo = 'cms/' . $rowPartner["logo"];
						}			
						$partnerList[] = array('id' => $rowPartner["id"], 'name' => $rowPartner["name"], 'description' => $rowPartner["description"], 'www' => $rowPartner["www"], 'fb' => $rowPartner["fb"], 'logo' => $logo);
					}
					$partners[] = array('name' => $row["name"], 'list' => $partnerList);
				}
			}	
		}
		$this->response($this->json($partners), 200);
	} else {
		$this->response('', 204);
	}
}

function getMediaPartners() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$mediaPartnerList = array();	
	@$edition = $request->edition;
	$sql = "SELECT id, name FROM media_partners_dictionary WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	$mediaPartners = array();
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$id = $row["id"];
			$sql = "SELECT id, name, description, www, logo, fb,  logo FROM media_partners WHERE type_id = $id AND event_edition='$edition'";	
			$resultPartner = $this->mysqli->query($sql);
			$mediaPartnerList = null;
			if ($resultPartner) {
				if (mysqli_num_rows($resultPartner) > 0) {
					while($rowPartner = mysqli_fetch_assoc($resultPartner)) {	
						$logo = '';	
						if ($rowPartner["logo"] != '') {
							$logo = 'cms/' . $rowPartner["logo"];
						}			
						$mediaPartnerList[] = array('id' => $rowPartner["id"], 'name' => $rowPartner["name"], 'description' => $rowPartner["description"], 'www' => $rowPartner["www"], 'fb' => $rowPartner["fb"], 'logo' => $logo);
					}
					$mediaPartners[] = array('name' => $row["name"], 'list' => $mediaPartnerList);
				}
			}	
		}
		$this->response($this->json($mediaPartners), 200);
	} else {
		$this->response('', 204);
	}
}

function getNews() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT * FROM news WHERE event_edition='$edition' ORDER BY date DESC";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {	
			$photo = '';	
			if ($row["photo"] != '') {
				$photo = 'cms/' . $row["photo"];
			}					
			$toReturn[] = array('id' => $row["id"], 'title' => $row["title"], 'date' => $row["date"], 'content' => $row["content"], 'priority' => $row["priority"], 'photo' => $photo);
		}
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getReport() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT id, content FROM report WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_assoc($result);
		$toReturn = array('content' => $row["content"]);
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getOrganizers() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT id, content FROM organizers WHERE event_edition='$edition'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_assoc($result);
		$toReturn = array('id' => $row["id"], 'content' => $row["content"]);
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}

function getMenuForEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$toReturn = array();
	@$edition = $request->edition;
	$sql = "SELECT name, public_name, title, url FROM menu WHERE event_edition='$edition' AND visibility=1 ORDER BY position";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {				
			$toReturn[] = array('public_name' => $row["public_name"], 'name' => $row["name"], 'title' => $row["title"], 'url' => $row["url"]);
		}
		$this->response($this->json($toReturn), 200);
	} else {
		$this->response('', 204);
	}
}
/*
* Encode array into JSON
*/
public function json($data){
	if(is_array($data)){
		return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	}
}
}

// Initiiate Library

$api = new API;
$api->processApi();
?>