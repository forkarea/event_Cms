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

private function checkAndSetNewPath($folders) {
	if ($folders != null) {
		$destination = '../';
		foreach($folders as $x => $folder) {
	    	$destination .= $folder;
			if(!is_dir($destination)) {
				mkdir($destination, 0775);
			}
			$destination .= '/';
		}
		return true;
	}
	return false;
}


function login(){

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$username = $request->username;
	@$pass = $request->password;
	@$passw = md5($pass);		
	$sql = "SELECT id, username, role, first_name, last_name, last_login, role FROM users WHERE username = '$username' AND password = '$passw'";
	$result = $this->mysqli->query($sql);

	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_array($result);			
		$datetime = date('Y-m-d H:i:s');
		$ses = $row["username"].$datetime;
		$sql = "UPDATE users SET last_login = '$datetime', session_id='".md5($ses)."' WHERE id = " .$row["id"];			
		$result = $this->mysqli->query($sql);
		if ($result) {	
			$this->response($this->json(array('user' => $ses, 'first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'role' => $row["role"],'url' => 'index.html')), 200);
		} else {
			$this->response('', 400);
		}
	} else {
		$this->response('',400);
	}
}

function logout(){
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$username = $request->username;
	@$session_id = $request->session_id;
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);

	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_array($result);			
		$sql = "UPDATE users SET session_id=-1 WHERE id = " .$row["id"];		
		$result = $this->mysqli->query($sql);
		if ($result) {	
			$this->response('', 200);
		} else {
			$this->response('', 400);
		}
	} else {
		$this->response('', 400);
	}

}

private function isLogged($request) {
	@$session_id = $request->session_id;
	@$username = $request->username;
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		return true;
	} else {
		$this->response('', 401);
		return false;
	}
}

private function isLoggedAsAdmin($request) {
	@$session_id = $request->session_id;
	@$username = $request->username;
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id' AND role='a'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		return true;
	} else {
		$this->response('', 401);
		return false;
	}
}

function isUserLogged() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->username;
	$sql = "SELECT id, first_name, last_name FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_assoc($result);
		$this->response($this->json(array('first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'isLoggedIn' => true)), 200);
	} else {
		$this->response('', 401);
	}
}

function getUserDetails() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->username;
	$sql = "SELECT id, username, first_name, last_name, email, last_login, role FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_assoc($result);
		$this->response($this->json(array('id' => $row["id"], 'username' => $row["username"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'email' => $row["email"])), 200);
	} else {
		$this->response('', 401);
	}
}

function addNewUser() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLoggedAsAdmin($request)) {
		@$username = $request->n_username;
		@$first_name = $request->first_name;
		@$last_name = $request->last_name;
		@$email = $request->email;
		@$role = $request->role;
		@$password = md5($request->password);
		$sql = "SELECT * FROM users WHERE username = '$username'";
		$result = $this->mysqli->query($sql);
		if(mysqli_num_rows($result) > 0) {
			$this->response('', 302);
		} else if($username != null &&
			$first_name != null &&
			$last_name!= null &&
			$email != null &&
			$role != null &&
			$password != null ) {

			$sql = "INSERT INTO users (
				username,
				first_name,
				last_name,
				email, 
				password, 
				role) 
values('$username',
	'$first_name',
	'$last_name',
	'$email',
	'$password',
	'$role')";

$result = $this->mysqli->query($sql);
if ($result) {
	$this->response('', 201);
} else {
	$this->response('', 409);
}
} else {
	$this->response('', 400);
}
}
}

function removeUser(){
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLoggedAsAdmin($request)) {
		@$id = $request->r_id;
		@$username = $request->r_username;
		$sql = "SELECT * FROM users WHERE username = '$username' AND id = '$id'";
		$result=$this->mysqli->query($sql);
		if(mysqli_num_rows($result) == 0) {
			$this->response('', 404);
		} else {
			$sql = "DELETE FROM users WHERE username = '$username' AND id = '$id'";
			$result=$this->mysqli->query($sql);
			if($result) {
				$this->response('',200);
			} else {
				$this->response('', 400);
			}
		}
	}
}

function changeUser() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->n_username;
	@$first_name= $request->first_name;
	@$role= $request->role;
	$valid = true;
	if (!isset($first_name) || strlen($first_name) < 2) {
		$this->response($this->json(array('message' => 'Bad first_name', 'code' => 'first_name')), 306);
		$valid = false;
	}
	@$last_name= $request->last_name;
	if (!isset($last_name) || strlen($last_name) < 2) {
		$this->response($this->json(array('message' => 'Bad last_name', 'code' => 'last_name')), 306);
		$valid = false;
	}
	@$email=$request->email;
	if (!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$this->response($this->json(array('message' => 'Bad email', 'code' => 'email')), 306);
		$valid = false;
	}

	if ($valid) {
		$sql = "SELECT id FROM users WHERE username = '$username'";
		$result = $this->mysqli->query($sql);
		if ($this->isLoggedAsAdmin($request)) {
			$sql = "UPDATE users SET first_name='$first_name', last_name='$last_name', email='$email', role='$role' WHERE username = '$username' ";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('',200);
			} else {
				$this->response($this->json(array('message' => 'Bad data')), 306);
			}
		}
	}
}

function changeUserAndPassword() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->n_username;
	@$first_name= $request->first_name;
	@$role= $request->role;
	$valid = true;
	$password = $request->password;
	if (!isset($password) || strlen($password) < 5) {
		$this->response($this->json(array('message' => 'Bad password', 'code' => 'oldpassword')), 306);
		$valid = false;
	}
	$password = md5($password);
	
	if (!isset($first_name) || strlen($first_name) < 2) {
		$this->response($this->json(array('message' => 'Bad first_name', 'code' => 'first_name')), 306);
		$valid = false;
	}
	@$last_name= $request->last_name;
	if (!isset($last_name) || strlen($last_name) < 2) {
		$this->response($this->json(array('message' => 'Bad last_name', 'code' => 'last_name')), 306);
		$valid = false;
	}
	@$email=$request->email;
	if (!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$this->response($this->json(array('message' => 'Bad email', 'code' => 'email')), 306);
		$valid = false;
	}

	if ($valid) {
		$sql = "SELECT id FROM users WHERE username = '$username'";
		$result = $this->mysqli->query($sql);
		if ($this->isLoggedAsAdmin($request)) {
			$sql = "UPDATE users SET first_name='$first_name', last_name='$last_name', email='$email', role='$role', password='$password' WHERE username = '$username' ";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('',200);
			} else {
				$this->response($this->json(array('message' => 'Bad data')), 306);
			}
		}
	}
}

function setUserDetails() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->username;
	@$first_name= $request->first_name;
	$valid = true;
	if (!isset($first_name) || strlen($first_name) < 2) {
		$this->response($this->json(array('message' => 'Bad first_name', 'code' => 'first_name')), 306);
		$valid = false;
	}
	@$last_name= $request->last_name;
	if (!isset($last_name) || strlen($last_name) < 2) {
		$this->response($this->json(array('message' => 'Bad last_name', 'code' => 'last_name')), 306);
		$valid = false;
	}
	@$email=$request->email;
	if (!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$this->response($this->json(array('message' => 'Bad email', 'code' => 'email')), 306);
		$valid = false;
	}

	if ($valid) {
		$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
		$result = $this->mysqli->query($sql);
		if ($this->isLogged($request)) {
			$sql = "UPDATE users SET first_name='$first_name', last_name='$last_name', email='$email' WHERE username = '$username' AND session_id='$session_id'";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->getUserDetails();
			} else {
				$this->response($this->json(array('message' => 'Bad data')), 306);
			}
		}
	}
}

function getUsersList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	if ($this->isLogged($request)) {
		$toReturn = array();
		$sql = "SELECT * FROM users";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {					
				$toReturn[] = array('id' => $row["id"], 'username' => $row["username"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'email' => $row["email"], 'last_login' => $row["last_login"], 'role' => $row["role"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function setPassword() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$session_id = $request->session_id;
	@$username = $request->username;
	$valid = true;
	@$oldpassword = $request->old_password;
	if (!isset($oldpassword) || strlen($oldpassword) < 5) {
		$this->response($this->json(array('message' => 'Bad oldpassword', 'code' => 'oldpassword')), 306);
		$valid = false;
	}
	@$newpassword = $request->new_password;
	if (!isset($newpassword) || strlen($newpassword) < 5) {
		$this->response($this->json(array('message' => 'Bad newpassword', 'code' => 'newpassword')), 306);
		$valid = false;
	}
	$oldpassword = md5($oldpassword);
	$newpassword = md5($newpassword);

	if ($valid) {
		$sql = "SELECT id FROM users where username = '$username' AND session_id='$session_id' AND password='$oldpassword'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			$sql="UPDATE users SET password='$newpassword' WHERE username = '$username' AND session_id='$session_id' AND password='$oldpassword'";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('', 200);
			} else {
				$this->response($this->json(array('message' => 'Bad data')), 306);
			}
		} else {
			$this->response('', 401);
		}
	}
}


// ------------------------------------------------ AKTUALNOŚCI ------------------------------------------------


function getNewsList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT * FROM news WHERE event_edition='$edition' ORDER BY date DESC";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {	
				$photo = '';	
				if ($row["photo"] != '') {
					$photo = $row["photo"] . '?' . microtime();
				}					
				$toReturn[] = array('id' => $row["id"], 'title' => $row["title"], 'date' => $row["date"], 'content' => $row["content"], 'priority' => $row["priority"], 'photo' => $photo);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function addNewNews() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$title = $request->title;
		@$date = new DateTime(substr($request->date, 0, 23), new DateTimeZone('Poland'));
		@$content = $request->content;		
		@$priority = $request->priority;
		@$edition = $request->edition;
		if($title != null &&
			$date != null &&
			$content != null &&
			$priority != null &&
			$edition != null) {
			$sql = "INSERT INTO news (title, date, content, priority, event_edition) 
				values ('$title','".$date->format('Y-m-d')."', '$content', $priority, $edition)";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response($this->json(array('news_id'=>$this->mysqli->insert_id)), 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function updateNews() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$title = $request->title;
		@$date = new DateTime(substr($request->date, 0, 23), new DateTimeZone('Poland'));
		@$content = $request->content;		
		@$priority = $request->priority;
		@$photo = $request->photo;
		@$news_id = $request->news_id;
		if( $title != null &&
			$date != null &&
			$content != null &&
			$priority != null) {
				$sql = "UPDATE news SET
						title = '$title',	
						date = '".$date->format('Y-m-d')."',	
						content = '$content',
						priority = '$priority'			
						WHERE id = $news_id";
			$result = $this->mysqli->query($sql);
			if ($photo == null) {
				$this->removeNewsPhoto($news_id);
			}
			if ($result) {
				$this->response('', 200);

			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function removeNews() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	if ($this->isLogged($request)) {
		$toReturn = array();
		@$id = $request->id;
		$this->removeNewsPhoto($id);
		$sql = "DELETE FROM news WHERE id ='$id'";
		$result = $this->mysqli->query($sql);
		if($result) {
			$this->response('', 200);
		} else {
			$this->response($this->json(array('message' => 'Usunięcie wiadomości nie powiodło się')), 400);
		}
	}
}

private function updateNewsPhoto($destination, $id) {
	if ($destination != null) {
		$sql = "UPDATE news SET	photo = '$destination' WHERE id = $id";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadNewsPhoto() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$id = $_REQUEST['news_id'];
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'news');
				if ($this->checkAndSetNewPath($folderPath)) {
					$destination = '../uploads/img/edition' . $edition . '/news/news_' . $id . '.' . $file_ext;
					$destinationForDatabase = 'uploads/img/edition' . $edition . '/news/news_' . $id . '.' . $file_ext;
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->updateNewsPhoto($destinationForDatabase, $id)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeNewsPhoto($id) {
	$sql = "SELECT photo FROM news WHERE id = '$id'";
	$resultPhoto = $this->mysqli->query($sql);
	$row = mysqli_fetch_assoc($resultPhoto);
	if ($row["photo"] != null) {
		unlink('../'.$row["photo"]);		
		$sql = "UPDATE news SET
				photo = ''						
				WHERE id = $id";
		$result = $this->mysqli->query($sql);
	}
}


// ------------------------------------------------ TRENERZY ------------------------------------------------


function getTrainersList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT * FROM trainers WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {	
				$photo = '';	
				if ($row["photo"] != '') {
					$photo = $row["photo"] . '?' . microtime();
				}					
				$toReturn[] = array('id' => $row["id"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"], 'description' => $row["description"], 'experience' => $row["experience"], 'photo' => $photo);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function getTrainersShortList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, first_name, last_name FROM trainers WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {					
				$toReturn[] = array('id' => $row["id"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function addNewTrainer() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$first_name = $request->first_name;		
		@$last_name = $request->last_name;
		@$description = $request->description;
		@$experience = $request->experience;
		if($edition != null &&
			$first_name != null &&
			$last_name != null) {
			$sql = "INSERT INTO trainers (
				first_name,	
				last_name,
				description,
				experience,
				event_edition
				) 
				values('$first_name', '$last_name', '$description', '$experience', $edition)";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response($this->json(array('trainer_id'=>$this->mysqli->insert_id)), 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function updateTrainer() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$first_name = $request->first_name;		
		@$last_name = $request->last_name;
		@$description = $request->description;
		@$experience = $request->experience;
		@$trainer_id = $request->trainer_id;
		@$photo = $request->photo;
		if( $trainer_id != null &&		    
			$first_name != null &&
			$last_name != null) {
				$sql = "UPDATE trainers SET
						first_name = '$first_name',	
						last_name = '$last_name',	
						description = '$description',
						experience = '$experience'			
						WHERE id = $trainer_id";
			$result = $this->mysqli->query($sql);
			if ($photo == null) {
				$this->removeTrainerPhoto($trainer_id);
			}
			if ($result) {
				$this->response('', 200);

			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function removeTrainer() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	if ($this->isLogged($request)) {
		$toReturn = array();
		@$id = $request->id;
		$sql = "SELECT * FROM agenda WHERE trainer_id = $id";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			$this->response($this->json(array('message'=>'Trener posiada przypisane do siebie wydarzenia w agendzie. Aby usunąć trenera usuń przypisane do niego wydarzenia w agendzie.')), 400);
		} else {
			$this->removePartnerLogo($id);
			$sql = "DELETE FROM trainers WHERE id ='$id'";
			$result = $this->mysqli->query($sql);
			if($result) {
				$this->response('', 200);
			} else {
				$this->response($this->json(array('message' => 'Usunięcie elementu agendy nie powiodło się')), 400);
			}
		}
	}
}

private function updateTrainerPhoto($destination, $id) {
	if ($destination != null) {
		$sql = "UPDATE trainers SET	photo = '$destination' WHERE id = $id";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadTrainerPhoto() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$id = $_REQUEST['trainer_id'];
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'trainer');
				if ($this->checkAndSetNewPath($folderPath)) {
					$destination = '../uploads/img/edition' . $edition . '/trainer/trainer_' . $id . '.' . $file_ext;
					$destinationForDatabase = 'uploads/img/edition' . $edition . '/trainer/trainer_' . $id . '.' . $file_ext;
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->updateTrainerPhoto($destinationForDatabase, $id)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeTrainerPhoto($id) {
	$sql = "SELECT photo FROM trainers WHERE id = '$id'";
	$resultPhoto = $this->mysqli->query($sql);
	$row = mysqli_fetch_assoc($resultPhoto);
	if ($row["photo"] != null) {
		unlink('../'.$row["photo"]);		
		$sql = "UPDATE trainers SET
				photo = ''						
				WHERE id = $id";
		$result = $this->mysqli->query($sql);
	}
}


// ------------------------------------------------ AGENDA ------------------------------------------------


function getAgendasList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT a.id, name, a.description, start_date, start_time, stop_date, stop_time, trainer_id, t.first_name, t.last_name FROM agenda a JOIN trainers t ON trainer_id = t.id WHERE a.event_edition='$edition' ORDER BY start_date ASC, start_time ASC";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {					
				$toReturn[] = array('id' => $row["id"], 'name' => $row["name"], 'description' => $row["description"], 'start_date' => $row["start_date"], 'start_time' => date('G:i', strtotime($row["start_time"])), 'stop_date' => $row["stop_date"], 'stop_time' => date('G:i', strtotime($row["stop_time"])), 'trainer_id' => $row["trainer_id"], 'first_name' => $row["first_name"], 'last_name' => $row["last_name"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}
function addNewAgenda() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$name = $request->name;
		$start_time = new DateTime($request->startTime, new DateTimeZone('Poland'));
		$start_date = new DateTime(substr($request->startDate, 0, 23), new DateTimeZone('Poland'));
		$stop_time = new DateTime($request->stopTime, new DateTimeZone('Poland'));
		$stop_date = new DateTime(substr($request->stopDate, 0, 23),new DateTimeZone('Poland'));
		@$trainer = $request->trainer;
		@$description = $request->description;
		$start_datetime = new DateTime(substr($request->startDate, 0, 23), new DateTimeZone('Poland'));
		$start_datetime->setTime($start_time->format('H'), $start_time->format('i'));
		$stop_datetime = new DateTime(substr($request->stopDate, 0, 23), new DateTimeZone('Poland'));
		$stop_datetime->setTime($stop_time->format('H'), $stop_time->format('i'));
		if($edition != null && $name != null && $start_time != null &&
			$start_date!= null && $stop_time != null && $stop_date != null &&
			$trainer != null && $description != null && $stop_datetime > $start_datetime) {
			$sql = "INSERT INTO agenda (name, start_date, start_time, stop_date, 
				stop_time, trainer_id, event_edition, description) 
				values('$name','".$start_date->format('Y-m-d')."','"
				.$start_time->format('H:i:s')."','".
				$stop_date->format('Y-m-d')."','".
				$stop_time->format('H:i:s')."', $trainer, $edition, '$description')";
				$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('', 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function changeAgenda() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$name = $request->name;
		$start_time = new DateTime($request->startTime, new DateTimeZone('Poland'));
		$start_date = new DateTime(substr($request->startDate, 0, 23), new DateTimeZone('Poland'));
		$stop_time = new DateTime($request->stopTime, new DateTimeZone('Poland'));
		$stop_date = new DateTime(substr($request->stopDate, 0, 23),new DateTimeZone('Poland'));
		@$trainer = $request->trainer;
		@$description = $request->description;
		$start_datetime = new DateTime(substr($request->startDate, 0, 23), new DateTimeZone('Poland'));
		$start_datetime->setTime($start_time->format('H'), $start_time->format('i'));
		$stop_datetime = new DateTime(substr($request->stopDate, 0, 23), new DateTimeZone('Poland'));
		$stop_datetime->setTime($stop_time->format('H'), $stop_time->format('i'));
		@$agenda_id= $request->agenda_id;
		if(	$name != null && $start_time != null && $start_date!= null &&
			$stop_time != null && $stop_date != null && $trainer != null &&
			$description != null && $stop_datetime > $start_datetime) {
			$sql = "UPDATE agenda SET
			name = '$name',
			start_date = '".$start_date->format('Y-m-d')."',
			start_time = '".$start_time->format('H:i:s')."',
			stop_date = '".$stop_date->format('Y-m-d')."', 
			stop_time = '".$stop_time->format('H:i:s')."', 
			trainer_id = $trainer,  
			description = '$description'
			WHERE id = $agenda_id";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('', 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych', 'result' => $result)), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function removeAgenda() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$sql = "DELETE FROM agenda WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		if ($result) {
			$this->response('', 200);
		} else {
			$this->response($this->json(array('message'=>'Błąd usuwania danych')), 400);
		}
	}
}


// ------------------------------------------------ PARTNERZY ------------------------------------------------


function getPartnersList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT p.id, p.name, description, www, logo, fb, type_id, logo, t.name as 'typeName' FROM partners p JOIN partners_dictionary t ON p.type_id = t.id WHERE p.event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {	
				$logo = '';	
				if ($row["logo"] != '') {
					$logo = $row["logo"] . '?' . microtime();
				}			
				$toReturn[] = array('id' => $row["id"], 'name' => $row["name"], 'description' => $row["description"], 'www' => $row["www"], 'fb' => $row["fb"], 'logo' => $logo, 'type' => $row["type_id"], 'typeName' => $row["typeName"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function addNewPartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$name = $request->name;		
		@$description = $request->description;
		@$www = $request->www;
		@$fb = $request->fb;
		@$type = $request->type;
		if($edition != null &&
			$name != null &&
			$type != null) {
			$sql = "INSERT INTO partners (name,	description, www, fb, type_id, event_edition) 
				values('$name', '$description', '$www', '$fb', '$type', $edition)";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response($this->json(array('partner_id'=>$this->mysqli->insert_id)), 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function updatePartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$name = $request->name;		
		@$description = $request->description;
		@$www = $request->www;
		@$fb = $request->fb;
		@$type = $request->type;
		@$partner_id = $request->partner_id;
		@$logo = $request->logo;
		if( $partner_id != null &&		    
			$name != null &&
			$type != null) {
			$sql = "UPDATE partners SET
						name = '$name',						 
						description = '$description',
						www = '$www',
						fb = '$fb',
						type_id = $type						
						WHERE id = $partner_id";
			$result = $this->mysqli->query($sql);
			if ($logo == null) {
				$this->removePartnerLogo($partner_id);
			}
			if ($result) {
				$this->response('', 200);

			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function removePartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$this->removePartnerLogo($id);
		$sql = "DELETE FROM partners WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		if ($result) {
			$this->response('', 200);
		} else {
			$this->response($this->json(array('message'=>'Błąd usuwania danych')), 400);
		}
	}
}

private function updatePartnerLogo($destination, $id) {
	if ($destination != null) {
		$sql = "UPDATE partners SET	logo = '$destination' WHERE id = $id";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadPartnerLogo() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$id = $_REQUEST['partner_id'];
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'partner');
				if ($this->checkAndSetNewPath($folderPath)) {
					$destination = '../uploads/img/edition' . $edition . '/partner/partner_' . $id . '.' . $file_ext;
					$destinationForDatabase = 'uploads/img/edition' . $edition . '/partner/partner_' . $id . '.' . $file_ext;
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->updatePartnerLogo($destinationForDatabase, $id)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removePartnerLogo($id) {
	$sql = "SELECT logo FROM partners WHERE id = '$id'";
	$resultLogo = $this->mysqli->query($sql);
	$row = mysqli_fetch_assoc($resultLogo);
	if ($row["logo"] != null) {
		unlink('../'.$row["logo"]);		
		$sql = "UPDATE partners SET
				logo = ''						
				WHERE id = $id";
		$result = $this->mysqli->query($sql);
	}
}


// ------------------------------------------------ PATRONI MEDIALNI ------------------------------------------------
		

function getMediaPartnersList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT p.id, p.name, description, www, logo, fb, type_id, logo, t.name as 'typeName' FROM media_partners p JOIN media_partners_dictionary t ON p.type_id = t.id WHERE p.event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {	
				$logo = '';	
				if ($row["logo"] != '') {
					$logo = $row["logo"] . '?' . microtime();
				}			
				$toReturn[] = array('id' => $row["id"], 'name' => $row["name"], 'description' => $row["description"], 'www' => $row["www"], 'fb' => $row["fb"], 'logo' => $logo, 'type' => $row["type_id"], 'typeName' => $row["typeName"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function addNewMediaPartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$name = $request->name;		
		@$description = $request->description;
		@$www = $request->www;
		@$fb = $request->fb;
		@$type = $request->type;
		if($edition != null &&
			$name != null &&
			$type != null) {
			$sql = "INSERT INTO media_partners (
				name,						 
				description,
				www,
				fb,
				type_id,
				event_edition
				) 
				VALUES('$name', '$description', '$www', '$fb', '$type', $edition)";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response($this->json(array('partner_id'=>$this->mysqli->insert_id)), 200);
			} else {
				$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

function updateMediaPartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$name = $request->name;		
		@$description = $request->description;
		@$www = $request->www;
		@$fb = $request->fb;
		@$type = $request->type;
		@$partner_id = $request->partner_id;
		@$logo = $request->logo;
		if( $partner_id != null &&		    
			$name != null &&
			$type != null) {
				$sql = "UPDATE media_partners SET
						name = '$name',						 
						description = '$description',
						www = '$www',
						fb = '$fb',
						type_id = $type
						WHERE id = $partner_id";
				$result = $this->mysqli->query($sql);
				if ($logo == null) {
					$this->removeMediaPartnerLogo($partner_id);
				}
				if ($result) {
					$this->response('', 200);

				} else {
					$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
				}
			} else {
				$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
			}
	}
}

function removeMediaPartner() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$this->removeMediaPartnerLogo($id);
		$sql = "DELETE FROM media_partners WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		if ($result) {
			$this->response('', 200);
		} else {
			$this->response($this->json(array('message'=>'Błąd usuwania danych')), 400);
		}
	}
}

private function updateMediaPartnerLogo($destination, $id) {
	if ($destination != null) {
		$sql = "UPDATE media_partners SET logo = '$destination' WHERE id = $id";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadMediaPartnerLogo() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$id = $_REQUEST['partner_id'];
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'mediaPartner');
				if ($this->checkAndSetNewPath($folderPath)) {
					$destination = '../uploads/img/edition' . $edition . '/mediaPartner/mediaPartner_' . $id . '.' . $file_ext;
					$destinationForDatabase = 'uploads/img/edition' . $edition . '/mediaPartner/mediaPartner_' . $id . '.' . $file_ext;
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->updateMediaPartnerLogo($destinationForDatabase, $id)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeMediaPartnerLogo($id) {
	$sql = "SELECT logo FROM media_partners WHERE id = '$id'";
	$resultLogo = $this->mysqli->query($sql);
	$row = mysqli_fetch_assoc($resultLogo);
	if ($row["logo"] != null) {
		unlink('../'.$row["logo"]);		
		$sql = "UPDATE media_partners SET
				logo = ''						
				WHERE id = $id";
		$result = $this->mysqli->query($sql);
	}
}



// ------------------------------------------------ RAPORT ------------------------------------------------


function getReport() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, content FROM report WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			$row = mysqli_fetch_assoc($result);
			$toReturn = array('id' => $row["id"], 'content' => $row["content"]);
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

private function addNewReport($edition) {
	if($edition != null) {
		$sql = "INSERT INTO report (event_edition) VALUES ($edition)";
		$result = $this->mysqli->query($sql);	
	}
}

function updateReport() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$content = $request->content;
		@$id = $request->id;
		if( $edition != null &&	$id != null) {
				$sql = "UPDATE report SET content = '$content' WHERE id = $id AND event_edition = $edition";
				$result = $this->mysqli->query($sql);
				if ($result) {
					$this->response('', 200);

				} else {
					$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
				}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}
// ------------------------------------------------ Organizatorzy ------------------------------------------------

function getOrganizers() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
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
}

private function addNewOrganizers($edition) {
	if($edition != null) {
		$sql = "INSERT INTO organizers (event_edition) VALUES ($edition)";
		$result = $this->mysqli->query($sql);	
	}
}

function updateOrganizers() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$content = $request->content;
		@$id = $request->id;
		if($edition != null &&	$id != null) {
				$sql = "UPDATE organizers SET content = '$content' WHERE id = $id AND event_edition = $edition";
				$result = $this->mysqli->query($sql);
				if ($result) {
					$this->response('', 200);

				} else {
					$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
				}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

// ------------------------------------------------ OPIS ------------------------------------------------


function getDescription() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, content FROM description WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			$row = mysqli_fetch_assoc($result);
			$toReturn = array('id' => $row["id"], 'content' => $row["content"]);
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

private function addNewDescription($edition) {
	if($edition != null) {
		$sql = "INSERT INTO description (event_edition) VALUES ($edition)";
		$result = $this->mysqli->query($sql);	
	}
}

function updateDescription() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$content = $request->content;
		@$id = $request->id;
		if($edition != null && $id != null) {
				$sql = "UPDATE description SET content = '$content' WHERE id = $id AND event_edition = $edition";
				$result = $this->mysqli->query($sql);
				if ($result) {
					$this->response('', 200);

				} else {
					$this->response($this->json(array('message'=>'Błąd zapisu danych')), 400);
				}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały wypełnione')), 400);
		}
	}
}

// ------------------------------------------------ RAPORT PHOTO-----------------------------------------------------
function getReportPhotoList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, photo FROM report_photos WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$toReturn[] = array('id' => $row["id"], 'url' => $row["photo"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

private function addReportPhoto($destination, $edition) {
	if ($destination != null) {
		$sql = "INSERT INTO report_photos (photo, event_edition) VALUES ('$destination', $edition)";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadReportPhoto() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				@$domain = $_REQUEST['domain'];
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'report');
				if ($this->checkAndSetNewPath($folderPath)) {
					$url_time = substr(microtime(), 2, 8);
					$destination = trim('../uploads/img/edition' . $edition . '/report/report' . $url_time . '_' . $edition . '.' . $file_ext);
					$destinationForDatabase = trim($domain . 'uploads/img/edition' . $edition . '/report/report' . $url_time .  '_' . $edition . '.' . $file_ext);
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->addReportPhoto($destinationForDatabase, $edition)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeReportPhoto() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$sql = "SELECT photo FROM report_photos WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		$row = mysqli_fetch_assoc($result);
		if ($row["photo"] != null) {
			unlink('../'.$row["photo"]);		
			$sql = "DELETE FROM report_photos 						
				WHERE id = $id";
			$result = $this->mysqli->query($sql);
		}
	}
}

// ------------------------------------------------ Organizatorzy PHOTO-----------------------------------------------------
function getOrganizersPhotoList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, photo FROM organizers_photos WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$toReturn[] = array('id' => $row["id"], 'url' => $row["photo"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

private function addOrganizersPhoto($destination, $edition) {
	if ($destination != null) {
		$sql = "INSERT INTO organizers_photos (photo, event_edition) VALUES ('$destination', $edition)";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadOrganizersPhoto() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				@$domain = $_REQUEST['domain'];
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'organizers');
				if ($this->checkAndSetNewPath($folderPath)) {
					$url_time = substr(microtime(), 2, 8);
					$destination = trim('../uploads/img/edition' . $edition . '/organizers/organizers' . $url_time . '_' . $edition . '.' . $file_ext);
					$destinationForDatabase = trim($domain . 'uploads/img/edition' . $edition . '/organizers/organizers' . $url_time .  '_' . $edition . '.' . $file_ext);
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->addOrganizersPhoto($destinationForDatabase, $edition)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeOrganizersPhoto() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$sql = "SELECT photo FROM organizers_photos WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		$row = mysqli_fetch_assoc($result);
		if ($row["photo"] != null) {
			unlink('../'.$row["photo"]);		
			$sql = "DELETE FROM organizers_photos 						
				WHERE id = $id";
			$result = $this->mysqli->query($sql);
		}
	}
}

// ------------------------------------------------ OPIS PHOTO-----------------------------------------------------
function getDescriptionPhotoList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, photo FROM description_photos WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$toReturn[] = array('id' => $row["id"], 'url' => $row["photo"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

private function addDescriptionPhoto($destination, $edition) {
	if ($destination != null) {
		$sql = "INSERT INTO description_photos (photo, event_edition) VALUES ('$destination', $edition)";
		$result = $this->mysqli->query($sql);
		return $result;
	} else {
		return false;
	}
}

function uploadDescriptionPhoto() {
	@$session_id = $_REQUEST['session_id'];
	@$username = $_REQUEST['username'];
	$sql = "SELECT id FROM users WHERE username = '$username' AND session_id='$session_id'";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		@$edition = $_REQUEST['edition'];
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		if(isset($_FILES['file'])){    
			$error = '';   
			$file_name = $_FILES['file']['name'];
			$file_size = $_FILES['file']['size'];
			$file_tmp = $_FILES['file']['tmp_name'];
			$file_type = $_FILES['file']['type'];   
			$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
			$extensions = array("jpeg","jpg","png");        
			if(in_array($file_ext, $extensions) === false) {
				$error = "Nieprawidlowe rozszerzenie pliku.";
			}
			if($file_size > 1048576) {
				$error = 'Rozmiar pliku przekracza 1MB.';
			}               
			if($error == null) {
				@$domain = $_REQUEST['domain'];
				$folderPath = array('1'=>'uploads', '2'=>'img', '3'=>'edition'.$edition, '4'=>'description');
				if ($this->checkAndSetNewPath($folderPath)) {
					$url_time = substr(microtime(), 2, 8);
					$destination = trim('../uploads/img/edition' . $edition . '/description/description' . $url_time . '_' . $edition . '.' . $file_ext);
					$destinationForDatabase = trim($domain . 'uploads/img/edition' . $edition . '/description/description' . $url_time .  '_' . $edition . '.' . $file_ext);
  					if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
  						if ($this->addReportPhoto($destinationForDatabase, $edition)) {
  							$this->response('', 200);
  						} else {
  							$this->response($this->json(array('error' => 'Błąd zapisu ścieżki do pliku.')), 400);
  						}
  					} else {
  						$this->response($this->json(array('error' => 'Błąd zapisu pliku')), 400);
  					}
  				} else {
  					$this->response($this->json(array('error' => 'Błąd tworzenia ścieżki folderów')), 400);
  				}
			} else {
				$this->response($this->json(array('error' => $error)), 306);
			}
		} else {
				$this->response($this->json(array('error' => 'Brak pliku')), 400);
		}
	} else {
		$this->response('', 401);
	}
}

private function removeDescriptionPhoto() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$id = $request->id;
		$sql = "SELECT photo FROM description_photos WHERE id = '$id'";
		$result = $this->mysqli->query($sql);
		$row = mysqli_fetch_assoc($result);
		if ($row["photo"] != null) {
			unlink('../'.$row["photo"]);		
			$sql = "DELETE FROM description_photos 						
				WHERE id = $id";
			$result = $this->mysqli->query($sql);
		}
	}
}

// ------------------------------------------------ EDYCJE ------------------------------------------------


function addNewEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$number = $request->number;
		@$name = $request->name;		 
		$start_date = new DateTime(substr($request->start_date, 0, 23), new DateTimeZone('Poland'));
		$stop_date = new DateTime(substr($request->stop_date, 0, 23), new DateTimeZone('Poland'));
		@$visibility = $request->visibility;
		if( $number != null && $name != null && $start_date != null && $stop_date != null && $stop_date >= $start_date) {
			if ($visibility == null) {
				$visibility = 0;
			}
			$sql = "INSERT INTO event_editions (
				number,	
				name,
				start_date,
				stop_date,
				visibility
				) 
				values($number, '$name', '".$start_date->format('Y-m-d')."', '".$stop_date->format('Y-m-d')."', $visibility)";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$sql2="SELECT id FROM event_editions WHERE number=$number";
				$result2 = $this->mysqli->query($sql2);
				$row = mysqli_fetch_assoc($result2);
				$this->addNewReport($row["id"]);
				$this->addNewOrganizers($row["id"]);
				$this->addNewDescription($row["id"]);
				$this->addMenuForEdition($row["id"]);
				$this->response('', 200);
			} else {
				$this->response('', 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały poprawnie wypełnione')), 400);
		}
	}
}

function changeEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition_id= $request->edition_id;
		@$number = $request->number;
		@$name = $request->name;
		$start_date = new DateTime(substr($request->startDate, 0, 23), new DateTimeZone('Poland'));
		$stop_date = new DateTime(substr($request->stopDate, 0, 23), new DateTimeZone('Poland'));
		@$visibility = $request->visibility;
		
		if( $number != null && $name != null && $start_date!= null 
		 && $stop_date != null && $edition_id != null && $stop_date >= $start_date) {		
			if ($visibility == null) {
				$visibility = 0;
			}
			$sql = "UPDATE event_editions SET
				number = $number,
				name = '$name',
				start_date = '".$start_date->format('Y-m-d')."',
				stop_date = '".$stop_date->format('Y-m-d')."', 
				visibility = $visibility
				WHERE id = $edition_id";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('', 200);
			} else {
				$this->response('', 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały poprawnie wypełnione')), 400);
		}
	}
}

function setEditionVisibility() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition_id= $request->edition_id;
		@$visibility = $request->visibility;
		
		if($edition_id != null) {
			if ($visibility == null) {
				$visibility = 0;
			}
			$sql = "UPDATE event_editions SET visibility = $visibility WHERE id = $edition_id";
			$result = $this->mysqli->query($sql);
			if ($result) {
				$this->response('', 200);
			} else {
				$this->response('', 400);
			}
		} else {
			$this->response($this->json(array('message'=>'Nie wszystkie pola zostały poprawnie wypełnione')), 400);
		}
	}
}

function getEditions() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		$sql = "SELECT id, number, start_date, stop_date FROM event_editions ORDER BY number DESC";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {			
				$toReturn[] = array('id' => $row["id"], 'number' => $row["number"], 'start_date' => $row["start_date"], 'stop_date' => $row["stop_date"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function getEditionsList() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		$sql = "SELECT id, number, name, start_date, stop_date, visibility FROM event_editions ORDER BY number DESC";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {			
				$toReturn[] = array('id' => $row["id"], 'number' => $row["number"], 'name' => $row["name"], 'start_date' => $row["start_date"], 'stop_date' => $row["stop_date"], 'visibility' => $row["visibility"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}


// ------------------------------------------------ MENU ------------------------------------------------		
	

private function addMenuForEdition($edition) {
	$menuArray = array( 
		array('Aktualności', 'Aktualności', 1, 1, 'Aktualności', 'include/news.html'),
		array('Opis', 'O szkoleniu', 2, 1, 'O szkoleniu', 'include/description.html'),
		array('Trenerzy', 'Trenerzy', 3, 1, 'Trenerzy', 'include/trainers.html'),
		array('Program', 'Program', 4, 1, 'Program', 'include/agenda.html'),
		array('Organizatorzy', 'Organizatorzy', 5, 1, 'Organizatorzy', 'include/organizers.html'),
		array('Partnerzy', 'Partnerzy', 6, 1, 'Partnerzy', 'include/partners.html'),
		array('Patroni', 'Patroni', 7, 1, 'Patroni medialni', 'include/mediaPartners.html'),
		array('Relacja', 'Relacja', 8, 1, 'Relacja', 'include/report.html'),
		array('Poprzednie edycje', 'Poprzednie edycje', 10, 1, 'Poprzednie edycje', 'include/edition.html')
	);
	foreach ($menuArray as $menu) {
		$sql = "INSERT INTO menu (name, public_name, position, visibility, title, url, event_edition) 
		VALUES ('$menu[0]', '$menu[1]', $menu[2], $menu[3], '$menu[4]', '$menu[5]', $edition)";
		$result = $this->mysqli->query($sql);
	}
}

function getMenuForEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, name, public_name, position, visibility, title FROM menu WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$toReturn[] = array('id' => $row["id"], 'name' => $row["name"], 'public_name' => $row["public_name"], 'position' => $row["position"], 'visibility' => $row["visibility"], 'title' => $row["title"]);
			}
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function saveMenuForEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$data = $request->data;
		foreach ($data as $menu) {
			$sql = "UPDATE menu SET public_name = '$menu[1]', position = $menu[2], visibility= $menu[3], title = '$menu[4]'
			    	WHERE id = $menu[5]";
			$result = $this->mysqli->query($sql);
		}
	}
}


// ------------------------------------------------ DASHBOARD ------------------------------------------------


function getDashboardForEdition() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$isOk =true;
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT count(id) as trainersCount  FROM trainers WHERE event_edition='$edition' ";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;
		}
		$row = mysqli_fetch_assoc($result);
		$trainersCount=$row["trainersCount"];
		
		$sql = "SELECT count(id) as partnersCount  FROM partners WHERE event_edition='$edition' ";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;		
		}
		$row = mysqli_fetch_assoc($result);
		$partnersCount=$row["partnersCount"];
		
		$sql = "SELECT count(id) as usersCount  FROM users";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;		
		}
		$row = mysqli_fetch_assoc($result);
		$usersCount = $row["usersCount"];
		
		$sql = "SELECT count(id) as mediaPartnersCount  FROM media_partners WHERE event_edition='$edition' ";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;		
		}
		$row = mysqli_fetch_assoc($result);
		$mediaPartnersCount = $row["mediaPartnersCount"];
		
		$sql = "SELECT count(id) as agendaCount  FROM agenda WHERE event_edition='$edition' ";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;		
		}
		$row = mysqli_fetch_assoc($result);
		$agendaCount = $row["agendaCount"];
		
		$sql = "SELECT count(id) as editionsCount  FROM event_editions ";
		$result = $this->mysqli->query($sql);
		if ($result == false) {
		$isOk=false;		
		}
		$row = mysqli_fetch_assoc($result);
		$editionsCount = $row["editionsCount"];
		if($isOk){					
			$toReturn = array('trainersCount' => $trainersCount, 'partnersCount' => $partnersCount, 'usersCount' => $usersCount, 'mediaPartnersCount' => $mediaPartnersCount, 'agendaCount' => $agendaCount, 'editionsCount' => $editionsCount);
			
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}


// ------------------------------------------------ SŁOWNIKI ------------------------------------------------


function getDictionaries() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		$toReturn = array();
		@$edition = $request->edition;
		$sql = "SELECT id, name FROM partners_dictionary WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		$partners = array();
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$partners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}	
		}
		$sql = "SELECT id, name FROM media_partners_dictionary WHERE event_edition='$edition'";
		$result2 = $this->mysqli->query($sql);
		$mediaPartners = array();
		if (mysqli_num_rows($result2) > 0) {
			while($row = mysqli_fetch_assoc($result2)) {				
				$mediaPartners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}
		}
		if ($result && $result2) {
			$toReturn = array('partners' => $partners, 'mediaPartners' => $mediaPartners);
			$this->response($this->json($toReturn), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function getPartnerDictionary() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		$sql = "SELECT id, name FROM partners_dictionary WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		$partners = array();
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$partners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}	
		}
		if ($result) {
			$this->response($this->json($partners), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function getMediaPartnerDictionary() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		$sql = "SELECT id, name FROM media_partners_dictionary WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		$mediaPartners = array();
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$mediaPartners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}
		}
		if ($result) {
			$this->response($this->json($mediaPartners), 200);
		} else {
			$this->response('', 204);
		}
	}
}

function savePartnersDictionary() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$isOk =true;
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$data = $request->data;
		$sql = "SELECT id, name FROM partners_dictionary WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		$partners = array();
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$partners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}	
		}
		foreach($data as $r) {
			if ($r->id < 0 && $r->name != null) {
				$sql = "INSERT INTO partners_dictionary (
					name,
					event_edition
				) 
				values('$r->name', $edition)";
				$result = $this->mysqli->query($sql);
			} else if ($r->id > 0 && array_key_exists('name', $r)) {
				$sql = "UPDATE partners_dictionary SET
						name = '$r->name'						 
						WHERE id = $r->id";
				$result = $this->mysqli->query($sql);
			} else if ($r->id > 0 && !array_key_exists('name', $r)) {
				$sql = "DELETE FROM partners_dictionary WHERE id = $r->id";
				$result = $this->mysqli->query($sql);
			}
		}
		$isExist = false;
		foreach($partners as $p) {
			foreach($data as $r) {
				if ($p["id"] == $r->id) {
					$isExist = true;
				}
			}
			if (!$isExist) {
				$id = $p["id"];
				$sql = "DELETE FROM partners_dictionary WHERE id = $id";
				$result = $this->mysqli->query($sql);
			}
			$isExist = false;
		}
		$this->response('', 200);
	}
}

function saveMediaPartnersDictionary() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$isOk =true;
	if ($this->isLogged($request)) {
		@$edition = $request->edition;
		@$data = $request->data;
		$sql = "SELECT id, name FROM media_partners_dictionary WHERE event_edition='$edition'";
		$result = $this->mysqli->query($sql);
		$partners = array();
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {				
				$partners[] = array('id' => $row["id"], 'name' => $row["name"]);
			}	
		}
		foreach($data as $r) {
			if ($r->id < 0 && $r->name != null) {
				$sql = "INSERT INTO media_partners_dictionary (
					name,
					event_edition
				) 
				values('$r->name', $edition)";
				$result = $this->mysqli->query($sql);
			} else if ($r->id > 0 && array_key_exists('name', $r)) {
				$sql = "UPDATE media_partners_dictionary SET
						name = '$r->name'						 
						WHERE id = $r->id";
				$result = $this->mysqli->query($sql);
			} else if ($r->id > 0 && !array_key_exists('name', $r)) {
				$sql = "DELETE FROM media_partners_dictionary WHERE id = $r->id";
				$result = $this->mysqli->query($sql);
			}
		}
		$isExist = false;
		foreach($partners as $p) {
			foreach($data as $r) {
				if ($p["id"] == $r->id) {
					$isExist = true;
				}
			}
			if (!$isExist) {
				$id = $p["id"];
				$sql = "DELETE FROM media_partners_dictionary WHERE id = $id";
				$result = $this->mysqli->query($sql);
			}
			$isExist = false;
		}
		$this->response('', 200);
	}
}


// ------------------------------------------------ KONFIGURACJA ------------------------------------------------


function addFirstUser() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$sql = "SELECT * FROM users";
	$result = $this->mysqli->query($sql);
	if (mysqli_num_rows($result) > 0) {
		$this->response('', 302);	
	} else {		
		@$username = $request->username;
		@$first_name = $request->first_name;
		@$last_name = $request->last_name;
		@$email = $request->email;
		@$role = $request->role;
		@$password = md5($request->password);			
		if($username != null &&
			$first_name != null &&
			$last_name!= null &&
			$email != null &&
			$role != null &&
			$password != null ) {
				$sql = "INSERT INTO users (
					username,
					first_name,
					last_name,
					email, 
					password, 
					role) 
					values('$username',
					'$first_name',
					'$last_name',
					'$email',
					'$password',
					'$role')";

				$result = $this->mysqli->query($sql);
				if ($result) {
					$this->response('', 201);
				} else {
					$this->response('', 409);
				}
			} else {
				$this->response('', 400);
			}
	}
}

function saveDB() {
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$db_server = $request->db_server;
	@$db_user = $request->db_user;
	@$db_password = $request->db_password;
	@$db_name = $request->db_name;	
	
	$fname = "db.php";
	$fhandle = fopen($fname,"w+");
	$content = "<?php
	const DB_SERVER = \"$db_server\";
	const DB_USER = \"$db_user\";
	const DB_PASSWORD = \"$db_password\";
	const DB = \"$db_name\";	
	?>";
	fwrite($fhandle,$content);
	fclose($fhandle);
	$this->response('', 200);
}

function createDB() {


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