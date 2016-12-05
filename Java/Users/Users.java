import java.sql.*;
// import Random.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;
import java.util.Set;

public class Users {
    // initialize variables
    private static Connection con;
    private static boolean hasData = false;
    private static String[] index = new String[] {"userID", "first_name", "last_name", "password", "email", "isActive", "avatar_url", "avatar_name", "confirmationPin", "playFilter", "tradeFilter", "chillFilter", "isAdmin", "phone_number", "birthMonth", "birthDay", "birthYear", "gender", "confirmed"};
    private static String[] string_index = new String[] {"userID", "first_name", "last_name", "password", "email", "avatar_url", "avatar_name", "confirmationPin", "phone_number", "birthMonth", "birthDay", "birthYear", "gender"};
    private static String[] bool_index = new String[] {"isActive", "playFilter", "tradeFilter", "chillFilter" ,"isAdmin", "confirmed"};

    // // generates random string of numchars length
    // private String randomString(int numchars) {
    //     Random r = new Random();
    //     StringBuffer sb = new StringBuffer();
    //     while(sb.length() < numchars){
    //         sb.append(Integer.toHexString(r.nextInt()));
    //     }

    //     return sb.toString().substring(0, numchars);
    // }


    public void getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.sqlite.JDBC");
        con = DriverManager.getConnection("jdbc:sqlite:users.db");
        initialize();
    }


    // creates the user_info table if it does not already exist
    private void initialize() throws SQLException {
		if (!hasData){
		hasData = true;
		Statement stmt = con.createStatement();
		String sql = "CREATE TABLE IF NOT EXISTS " + "user_info" +
		         " (userID TEXT, first_name TEXT, last_name TEXT, password TEXT," + 
		         "email TEXT, isActive BOOLEAN, avatar_url TEXT, avatar_name TEXT," +
		          "confirmationPin TEXT, playFilter BOOLEAN, tradeFilter BOOLEAN," + 
		          "chillFilter BOOLEAN, isAdmin BOOLEAN, phone_number TEXT," + 
		          "birthMonth TEXT, birthDay TEXT, birthYear TEXT, gender TEXT," + 
		          "confirmed BOOLEAN)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS userID ON user_info (userID)";
		stmt.executeUpdate(sql);
		stmt.close();
		
		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS email ON user_info (email)";
		stmt.executeUpdate(sql);
		stmt.close();


      }
    }



	public void resetDatabase() throws ClassNotFoundException, SQLException{
		deleteTable("user_info");
		hasData = false;
		getConnection();
	}


	// given the table name deletes that table
	public void deleteTable(String table_name) throws ClassNotFoundException, SQLException{
		if (con == null){
			getConnection();
		}
		else {
		Statement stmt = con.createStatement();
		String sql = "DROP TABLE IF EXISTS " + table_name;
		stmt.executeUpdate(sql);
		stmt.close();
		}
	}



	public void addUser(String userID, String first_name, String last_name, String password, String email, boolean isActive, String avatar_url, String avatar_name, String confirmationPin, boolean tradeFilter, boolean playFilter, boolean chillFilter, boolean isAdmin, String phone_number, String birthMonth, String birthDay, String birthYear, String gender, boolean confirmed) throws SQLException, ClassNotFoundException {

		PreparedStatement stmt = con.prepareStatement("INSERT INTO user_info" +
			"(userID, first_name, last_name, password, email, isActive, avatar_url," + 
			"avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter," + 
			"isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed)" + 
			 " VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		stmt.setString(1, userID);
		stmt.setString(2, first_name);
		stmt.setString(3, last_name);
		stmt.setString(4, password);
		stmt.setString(5, email);
		stmt.setBoolean(6, isActive);
		stmt.setString(7, avatar_url);
		stmt.setString(8,avatar_name);
		stmt.setString(9, confirmationPin);
		stmt.setBoolean(10, tradeFilter);
		stmt.setBoolean(11, playFilter);
		stmt.setBoolean(12, chillFilter);
		stmt.setBoolean(13, isAdmin);
		stmt.setString(14, phone_number);
		stmt.setString(15, birthMonth);
		stmt.setString(16, birthDay);
		stmt.setString(17, birthYear);
		stmt.setString(18, gender);
		stmt.setBoolean(19, confirmed);
		stmt.executeUpdate();
		stmt.close();
	}


	public void updateInfo(String userID, String field_name, String field_data) throws SQLException, ClassNotFoundException {
		String sql = "UPDATE user_info SET " + field_name + " = ? WHERE userID = '" + userID + "'";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, field_data);
		stmt.executeUpdate();
		stmt.close();

	}

	public void updateInfo(String userID, String field_name, boolean field_data) throws SQLException, ClassNotFoundException {
		String sql = "UPDATE user_info SET " + field_name + " = ? WHERE userID = '" + userID + "'";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setBoolean(1, field_data);
		stmt.executeUpdate();
		stmt.close();
	}

	public Map<String, Object> getInfoFromId(String userID) throws ClassNotFoundException, SQLException {
		
		Map<String,Object> map = new HashMap <String, Object>();

		String sql = "SELECT * FROM user_info WHERE userID = '" + userID + "'";
		PreparedStatement stmt = con.prepareStatement(sql);
		ResultSet rs = stmt.executeQuery();
		while (rs.next()){
			for (String field_name : string_index){
				map.put(field_name, rs.getString(field_name));
			}

			for (String field_name : bool_index) {
				map.put(field_name, rs.getBoolean(field_name));
			} 

		}
		return map;
	}


	public void addTestUsers() throws SQLException, ClassNotFoundException{
	String[] first_name = new String[] {"Darek", "Eli", "Brian", "Luis", "Paul", "Mashi", "Yuuya", "Shouta", "Gabby"};
	String[] last_name = new String[] {"Johnson", "Chang", "Kibler", "Scott-Vargas", "Cheon","Scanlan", "Watanabe", "Yasooka", "Spartz"};
	String[] userID = new String[] {"darekj", "elic", "briank", "luisv", "paulc", "mashis", "yuuyaw", "shoutay", "gabbys"};
	String[] gender = new String[] {"Male","Male","Male","Male","Male","Male","Male","Male", "Female"};
	String[] birthYear = new String[] {"1994", "1994", "1984", "1882", "1986", "1984", "1990", "1990", "1990"};
	String[] birthMonth = new String[] {"8","3","2","10", "9", "5", "11", "12", "2"};
	String[] birthDay = new String[] {"28","13","11","18","29","8","4"," 10","28"};
	String[] password = new String[] {"pass1","pass1","pass1","pass1","pass1","pass1","pass1", "pass1", "pass1"};
	String[] home_zip = new String[] {"19131", "19131", "19131", "19131", "19131", "19131", "19131", "19131", "19131"};

	boolean isActive = true;
	boolean tradeFilter = false;
	boolean playFilter = false;
	boolean chillFilter = false;
	String phone_number = "555-555-5555";
	boolean isAdmin = false;
	String email;
	String confirmationPin;
	String avatar_url;
	String[] slash_splits;
	String avatar_name;
	boolean confirmed = true;

	for (int i = 0; i < userID.length; i++) {
		email = userID[i] + "@gmail.com";
		confirmationPin = "confirmationPin";

		avatar_url = "./static/avatars/gideon.png";
		slash_splits = avatar_url.split("/");


		avatar_name = slash_splits[slash_splits.length-1].split("\\.")[0];


		addUser(userID[i], first_name[i], last_name[i],password[i], email, isActive,
			 avatar_url, avatar_name , confirmationPin, tradeFilter, playFilter, chillFilter,
			isAdmin, phone_number,  birthMonth[i], birthDay[i], birthYear[i],
			gender[i], confirmed);
		
		}
		
	}

	public static void main( String args[]) throws ClassNotFoundException, SQLException {
		Users udb = new Users();
		udb.getConnection(); 
		udb.deleteTable("user_info");
		udb.resetDatabase();
		udb.addTestUsers();
		udb.updateInfo("darekj", "first_name", "mrd");
		udb.updateInfo("darekj", "isAdmin", true);
		Map<String, Object> map = udb.getInfoFromId("darekj");
		for (String key : map.keySet()){
			System.out.println(key + " : " + map.get(key));
		}
	}
}

