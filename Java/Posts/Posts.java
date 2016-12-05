import java.sql.*;
import java.util.Random;
import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;
import java.util.Set;
import java.util.LinkedList;
import java.sql.Timestamp;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.DateFormat;


public class Posts {
    // initialize variables
    private static Connection con;
    private static boolean hasData = false;
    private static String[] post_index = new String[] {"body", "poster_id", "feed_name","comment_id", "timeString", "timeStamp", "isTrade", "isPlay", "isChill", "isComment"};
    private static String[] post_string_index = new String[] {"body", "poster_id", "feed_name","comment_id", "timeString", "timeStamp"};
    private static String[] post_bool_index = new String[] {"isTrade", "isPlay", "isChill", "isComment"};
    
    private static String[] comment_index = new String[] {"body", "poster_id", "feed_name","comment_id", "timeString", "timeStamp", "unique_id", "isComment"};
    private static String[] comment_string_index = new String[] {"body", "poster_id", "feed_name","comment_id", "timeString", "timeStamp", "unique_id"};
    private static String[] comment_bool_index = new String[] {"isComment"};

    // generates random string of numchars length
    private String randomString(int numchars) {
        Random r = new Random();
        StringBuffer sb = new StringBuffer();
        while(sb.length() < numchars){
            sb.append(Integer.toHexString(r.nextInt()));
        }

        return sb.toString().substring(0, numchars);
    }


    public void getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.sqlite.JDBC");
        con = DriverManager.getConnection("jdbc:sqlite:posts.db");
    }


    public void initialize() throws ClassNotFoundException, SQLException {
    	getConnection();
    	createFeedNameTable();
    	createCommentIdTable();
    	createReportTable();
    	
    }


	public void resetDatabase() throws ClassNotFoundException, SQLException{
		getConnection();
		Statement stmt = con.createStatement();
		String sql = "SELECT name FROM sqlite_master WHERE type='table';";
		ResultSet rs = stmt.executeQuery(sql);
		LinkedList<String> table_list = new LinkedList<String>();

		while (rs.next()) {
			table_list.add(rs.getString("name"));
		}

		for (String table_name : table_list) {
			deleteTable(table_name);
		}
		rs.close();
		stmt.close();
		
		initialize();
	}


	// given the table name deletes that table
	public void deleteTable(String table_name) throws ClassNotFoundException, SQLException{

		Statement stmt = con.createStatement();
		String sql = "DROP TABLE IF EXISTS " + table_name;
		stmt.executeUpdate(sql);
		stmt.close();
	}


	// creates the posts and comment table for this feed
	public void createThread(String feed_name) throws ClassNotFoundException, SQLException{
		Statement stmt = con.createStatement();
		String sql = "CREATE TABLE IF NOT EXISTS " + feed_name +
		         " (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp REAL, isTrade BOOLEAN, isPlay BOOLEAN, isChill BOOLEAN)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS poster_id ON " + feed_name + " (poster_id)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS comment_id ON " + feed_name + " (comment_id)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS timeStamp ON " + feed_name + " (timeStamp)";
		stmt.executeUpdate(sql);
		stmt.close();

		String c_table_name = "c_" + feed_name;
		stmt = con.createStatement();
		sql = "CREATE TABLE IF NOT EXISTS c_" + feed_name + " (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp REAL, unique_id TEXT)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS poster_id ON " + c_table_name + " (poster_id)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS comment_id ON " + c_table_name + " (comment_id)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS timeStamp ON " + c_table_name + " (timeStamp)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS unique_id ON " + c_table_name + " (unique_id)";
		stmt.executeUpdate(sql);
		stmt.close();

		
		// add the feed name to the table
		// FIXTHIS
		addFeedName(feed_name);
	}

	// creates table with the name of every feed
	public void createFeedNameTable() throws ClassNotFoundException, SQLException{
		Statement stmt = con.createStatement();
		String sql = "CREATE TABLE IF NOT EXISTS " + "feed_names" +
		         " (feed_name TEXT)";
		stmt.executeUpdate(sql);
		stmt.close();
	}


	// creates the report table 
	public void createReportTable() throws ClassNotFoundException, SQLException{
		Statement stmt = con.createStatement();
		String sql = "CREATE TABLE IF NOT EXISTS " + "report_table" +
		         " (feed_name TEXT, id TEXT, body TEXT, reason TEXT ,isComment BOOLEAN, description TEXT, timeString TEXT, timeStamp REAL, reporting_user, reported_user)";
		stmt.executeUpdate(sql);
		stmt.close();

		stmt = con.createStatement();
		sql = "CREATE INDEX IF NOT EXISTS id ON " + "report_table" + " (id)";
		stmt.executeUpdate(sql);
		stmt.close();
	}


	public void reportPost (String feed_name, String comment_id, String reason, String description, String reporting_user, String reported_user) throws ClassNotFoundException, SQLException {
		long unixTime = System.currentTimeMillis() / 1000L;
		Date date = new Date(unixTime * 1000L);
		
		// FIXTHIS body = getCommentById(feed_name, comment_id)
		String body = "placeholder";
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		double timeStamp = System.currentTimeMillis();
		String timeString = format.format(date);
		PreparedStatement stmt = con.prepareStatement("INSERT INTO report_table (feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (?,?,?,?,?,?,?,?,?,?)");
		stmt.setString(1, feed_name);
		stmt.setString(2, comment_id);
		stmt.setString(3, body);
		stmt.setString(4, reason);
		stmt.setBoolean(5, false);		
		stmt.setString(6, description);
		stmt.setDouble(7, timeStamp);
		stmt.setString(8, timeString);
		stmt.setString(9, reported_user);
		stmt.setString(10, reporting_user);
		stmt.executeUpdate();
		stmt.close();	
	}

	public void reportComment(String feed_name, String unique_id, String reason, String description, String reporting_user, String reported_user) throws ClassNotFoundException, SQLException {
		long unixTime = System.currentTimeMillis() / 1000L;
		Date date = new Date(unixTime * 1000L);
		
		// FIXTHIS body = getCommentById(feed_name, comment_id)
		String body = "placeholder";
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		double timeStamp = System.currentTimeMillis();
		String timeString = format.format(date);
		PreparedStatement stmt = con.prepareStatement("INSERT INTO report_table (feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (?,?,?,?,?,?,?,?,?,?)");
		stmt.setString(1, feed_name);
		stmt.setString(2, unique_id);
		stmt.setString(3, body);
		stmt.setString(4, reason);
		stmt.setBoolean(5, true);
		stmt.setString(6, description);
		stmt.setDouble(7, timeStamp);
		stmt.setString(8, timeString);
		stmt.setString(9, reported_user);
		stmt.setString(10, reporting_user);
		stmt.executeUpdate();
		stmt.close();	
	}


	// gets a new unique_id
	public String hash_id(String s) throws SQLException, ClassNotFoundException {
		int hash_code = 7;
		for (int i = 0; i < s.length(); i++){
			hash_code = ((hash_code * 31 + s.charAt(i)) & 0xfffffff);
		} 
		String unique_id = String.valueOf(hash_code);

		while (cIdTaken(unique_id)){
			unique_id = Integer.toString(Integer.parseInt(unique_id) + 1);
		}
		return unique_id;
	}

	// returns a map with all the post information given it's unique id
	public HashMap<String, Object> getPostbyId(String feed_name, String comment_id) throws SQLException, ClassNotFoundException {
		HashMap<String, Object> map = new HashMap<String, Object>();
		PreparedStatement stmt = con.prepareStatement("SELECT * FROM " + feed_name + " WHERE comment_id = ?");
		stmt.setString(1, comment_id);
		ResultSet rs = stmt.executeQuery();
		if (rs.next()){
			for (String field_name: post_string_index) {
				map.put(field_name, rs.getString(feed_name));
			}
			for (String field_name: post_bool_index) {
				map.put(field_name, rs.getBoolean(feed_name));
			}
		}

		rs.close();
		stmt.close();
		return map;
	}

	// returns a map with all the post information given it's unique id
	public HashMap<String, Object> getCommentbyId(String feed_name, String unique_id) throws SQLException, ClassNotFoundException {
		HashMap<String, Object> map = new HashMap<String, Object>();
		String c_table_name = "c_" + feed_name;
		PreparedStatement stmt = con.prepareStatement("SELECT * FROM " + c_table_name + " WHERE comment_id = ?");
		stmt.setString(1, unique_id);
		ResultSet rs = stmt.executeQuery();
		if (rs.next()){
			for (String field_name: comment_string_index) {
				map.put(field_name, rs.getString(feed_name));
			}
			for (String field_name: comment_bool_index) {
				map.put(field_name, rs.getBoolean(feed_name));
			}
		}

		rs.close();
		stmt.close();
		return map;
	}

	// adds feed name to feed name table
	public void addFeedName(String feed_name) throws SQLException, ClassNotFoundException {
		String sql = "INSERT INTO feed_names " + " (feed_name) VALUES (?)";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, feed_name);

		stmt.executeUpdate();
		stmt.close();
	}

	// creates comment table
	public void createCommentIdTable() throws SQLException, ClassNotFoundException {
		String comment_table_name = "c_id";
		String sql = "CREATE TABLE IF NOT EXISTS " + comment_table_name + " (comment_id TEXT)";
		Statement stmt = con.createStatement();
		stmt.executeUpdate(sql);
		stmt.close();
	}		


	// feedNametaken
	// might have to check this later
	public boolean feedNametaken(String feed_name) throws SQLException, ClassNotFoundException{
		String sql = "SELECT * FROM feed_names WHERE feed_name = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, feed_name);
		ResultSet rs = stmt.executeQuery();
		if (rs.next()){
			return true;
		}
		else {
			return false;
		}

	}

	// checks if the comment ID is taken
	public boolean cIdTaken(String comment_id) throws SQLException, ClassNotFoundException{
		String sql = "SELECT * FROM c_id WHERE comment_id = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, comment_id);
		ResultSet rs = stmt.executeQuery();
		if (rs.next()){
			return true;
		}
		else {
			return false;
		}
	}

	// adds comment_id to list
	public void addCommentIdToList(String comment_id)throws SQLException, ClassNotFoundException{
		String sql = "INSERT INTO c_id (comment_id) VALUES (?)";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, comment_id);
		stmt.executeUpdate();
		stmt.close();
	}


	// posts in a thread
	public void postInThread(String feed_name, String body,String poster_id, boolean isTrade , boolean isPlay ,boolean isChill) throws SQLException, ClassNotFoundException{
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		double timeStamp = System.currentTimeMillis();
		long unixTime = System.currentTimeMillis();
		Date date = new Date(unixTime * 1000L);
		String timeString = format.format(date);

		String comment_id = hash_id(String.valueOf(timeStamp));
		addCommentIdToList(comment_id);

		String sql = "INSERT INTO " + feed_name + " (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill) VALUES (?,?,?,?,?,?,?,?,?)";
		
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, body);
		stmt.setString(2, poster_id);
		stmt.setString(3, feed_name);
		stmt.setString(4, comment_id);
		stmt.setString(5, timeString);
		stmt.setDouble(6, timeStamp);
		stmt.setBoolean(7, isTrade);
		stmt.setBoolean(8, isPlay);
		stmt.setBoolean(9, isChill);
		stmt.executeUpdate();
		stmt.close();
	}


	// makes a comment
	public void makeComment(String feed_name, String comment_id, String body, String poster_id) throws SQLException, ClassNotFoundException {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		double timeStamp = System.currentTimeMillis();
		long unixTime = System.currentTimeMillis();
		Date date = new Date(unixTime * 1000L);
		String timeString = format.format(date);
		String unique_id = hash_id(comment_id);
		addCommentIdToList(unique_id);
		String sql = "INSERT INTO c_" + feed_name + " (body, poster_id, feed_name, comment_id, timeString, timeStamp, unique_id) VALUES (?,?,?,?,?,?,?)";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1,body);
		stmt.setString(2, poster_id);
		stmt.setString(3, feed_name);
		stmt.setString(4,comment_id);
		stmt.setString(5, timeString);
		stmt.setDouble(6, timeStamp);
		stmt.setString(7,unique_id);
		stmt.executeUpdate();
		stmt.close();
	}

	// sort the output of getPosts 
	// sortAscending
	// sort descending	

	// FIX THIS USING ARRAYS VS LINKED LIST
	public LinkedList<HashMap<String, Object>> getPosts(String feed_name, boolean tradeFilter, boolean playFilter, boolean chillFilter) throws SQLException, ClassNotFoundException {
		String sql = "SELECT * FROM " + feed_name;

		if (tradeFilter || playFilter || chillFilter){
			sql = sql + " WHERE ";
		}

		if (tradeFilter){
			sql = sql + "isTrade = 1 ";
			if (playFilter) {
				sql = sql + "OR isPlay = 1 ";
			}
			if (chillFilter) {
				sql = sql + "OR isChill = 1";
			}
		}
		else if (playFilter) {
			sql = sql + "isPlay = 1 ";
			if (chillFilter) {
				sql = sql + "OR isChill = 1";
			}
		}

		else if (chillFilter) {
			sql = sql + "isChill = 1";
		}

		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		LinkedList<HashMap<String, Object>> post_list = new LinkedList<HashMap<String,Object>>(); 
		// FIX might have to put rs.next() at the end not beginning
		while(rs.next()){

			HashMap<String, Object> post = new HashMap<String,Object>();
			post.put("body", rs.getString("body"));
			post.put("poster_id", rs.getString("poster_id"));
			post.put("feed_name", rs.getString("feed_name"));
			post.put("timeString", rs.getString("timeString"));
			post.put("timeStamp", rs.getDouble("timeStamp"));
			post.put("isTrade", rs.getBoolean("isTrade"));
			post.put("isPlay", rs.getBoolean("isPlay"));
			post.put("isChill", rs.getBoolean("isChill"));
			post.put("comment_id", rs.getString("comment_id"));
			post.put("isComment", false);
			post_list.add(post);
		}

		rs.close();
		stmt.close();
		return post_list;
	}

	public LinkedList<HashMap<String, Object>> getPosts(String feed_name) throws SQLException, ClassNotFoundException {
		return getPosts(feed_name, true, true, true);
	}



	public LinkedList<HashMap<String, Object>> getComments(String feed_name, String comment_id)  throws SQLException, ClassNotFoundException {
		String sql = "SELECT * FROM c_" + feed_name + " WHERE comment_id = ?";
		PreparedStatement stmt = con.prepareStatement(sql);
		stmt.setString(1, comment_id);
		ResultSet rs = stmt.executeQuery(sql);
		
		int count = 0;
		while (rs.next()){
			count++;
		}

		rs.close();
		rs = stmt.executeQuery(sql);

		LinkedList<HashMap<String, Object>> comment_list = new LinkedList<HashMap<String,Object>>();
		// FIX might have to put rs.next() at the end not beginning
		while(rs.next()){
			
			HashMap<String,Object> comment = new HashMap<String,Object>();
			comment.put("body", rs.getString("body"));
			comment.put("poster_id", rs.getString("poster_id"));
			comment.put("feed_name", rs.getString("feed_name"));
			comment.put("timeString", rs.getString("timeString"));
			comment.put("timeStamp", rs.getDouble("timeStamp"));
			comment.put("comment_id", rs.getString("comment_id"));
			comment.put("unique_id", rs.getString("unique_id"));
			comment.put("isComment", false);
			comment_list.add(comment);
		}

		rs.close();
		stmt.close();
		return comment_list;
	
	}

	public LinkedList<HashMap<String,Object>> getAll(String feed_name) throws SQLException, ClassNotFoundException {
		LinkedList<HashMap<String, Object>> all_list = getPosts(feed_name);
		String sql = "SELECT * FROM c_" + feed_name;


		Statement stmt = con.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		
		int count = 0;
		while (rs.next()){
			count++;
		}

		rs.close();
		rs = stmt.executeQuery(sql);

		// FIX might have to put rs.next() at the end not beginning
		while(rs.next()){
			
			HashMap<String,Object> comment = new HashMap<String,Object>();
			comment.put("body", rs.getString("body"));
			comment.put("poster_id", rs.getString("poster_id"));
			comment.put("feed_name", rs.getString("feed_name"));
			comment.put("timeString", rs.getString("timeString"));
			comment.put("timeStamp", rs.getDouble("timeStamp"));
			comment.put("comment_id", rs.getString("comment_id"));
			comment.put("unique_id", rs.getString("unique_id"));
			comment.put("isComment", false);
			all_list.add(comment);
		}

		rs.close();
		stmt.close();
		return all_list;	
	}


	// FIX THIS LATER
	// DECIDING WHETHER TO JUST FILTER A LIST OF RUN ANOTHER QUERY
	// decided to filter
	// will literally modify the list sent 
	// need checks to make sure that inputs are OK
	public LinkedList<HashMap<String, Object>> filter_list(LinkedList<HashMap<String, Object>> all_list, String field_name, Object field_data) {
		boolean string_search = false;
		if (field_name.toLowerCase().equals("body")){
			string_search = true;
		}

		LinkedList<HashMap<String, Object>> remove_list = new LinkedList<HashMap<String, Object>>();
		// if we search for a string
		if (string_search){
			for (HashMap<String, Object> map : all_list){
				String body = map.get("body").toString();
				// check if the string is in the body
				if (body.indexOf(field_data.toString()) == -1){
					remove_list.add(map);
				}
			}
		}

		else {
			for (HashMap<String, Object> map : all_list){
				if (map.get(field_name).equals(field_data)){
					remove_list.add(map);
				}
			}
		}

		// remove all the maps that don't match
		for (HashMap<String, Object> map : remove_list){
			all_list.remove(map);
		}
		return all_list;
	}



	public void test(int test_size) throws SQLException, ClassNotFoundException{
		resetDatabase();

		String feed_name = "ATL";
		createThread(feed_name);

		String[] testUsers =  new String[] {"A", "B", "C", "D", "E", "F", "G"};
		int post_length = 4;

		for (int n = 0; n < test_size; n++){


			int user_index = (int) (Math.random() * 7);

			
			boolean isTrade = ((int)(Math.random()*2) == 1);
			boolean isPlay = ((int)(Math.random()*2) == 1);
			boolean isChill = ((int)(Math.random()*2) == 1);
			String body = randomString(post_length);

			postInThread(feed_name, body, testUsers[user_index], isTrade, isPlay, isChill);
				
			}
	
		LinkedList<HashMap<String, Object>> all_posts = getPosts(feed_name);

		// // Prints out all the posts
		// for (HashMap<String, Object> post : all_posts){
		// 	for (String key : post.keySet()){
		// 		System.out.print(key + " - " + post.get(key) + " | ");
		// 	}
		// 	System.out.println();
		// }

		for (HashMap<String, Object> post : all_posts){
			int randomInt = ((int) Math.random()*9);
			if (randomInt < 4) {
				int numComments = ((int) Math.random()*5) + 1;
				for (int i = 0; i < numComments; i++){
					int user_index = (int) (Math.random() * 7);
					String body = randomString(post_length);
					makeComment(feed_name, post.get("comment_id").toString(), body, testUsers[user_index]);
				}
			}
		}


		LinkedList<HashMap<String, Object>> all_list = getAll(feed_name);
		String s = "f";
		System.out.println(all_list.size());
		System.out.println("------------");
		filter_list(all_list, "body", s);

		for (HashMap<String, Object> map : all_lists){
			System.out.println(map.get("body").toString());
		}

		
		
		System.out.println("------------");
		System.out.println(all_list.size());



		for (HashMap<String, Object> map : all_list){
			int user_index = ((int) Math.random() * 7);
			if ((Boolean) map.get("isComment")) {
				int randomInt = ((int) Math.random()*9);
				if (randomInt < 4){
					reportComment(feed_name, map.get("unique_id").toString(), randomString(4), randomString(4),testUsers[user_index], map.get("poster_id").toString());
				}
			}

			else {
				int randomInt = ((int) Math.random()*9);
				if (randomInt < 4){
					reportPost(feed_name, map.get("comment_id").toString(), randomString(4), randomString(4), testUsers[user_index], map.get("poster_id").toString());
				}
			}
		}


	
		// all_posts = getPosts(feed_name)
		System.out.println("test successful");
	}

	public static void main( String args[]) throws ClassNotFoundException, SQLException {
		Posts pdb = new Posts();
		
		pdb.resetDatabase();
		//pdb.test();
		long unixTime = System.currentTimeMillis() / 1000L;
		Date date = new Date(unixTime * 1000L);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		System.out.println(format.format(date));
		String timeStamp = String.valueOf(System.currentTimeMillis());
		int test_size = 800;
		pdb.test(test_size);

	}
}

