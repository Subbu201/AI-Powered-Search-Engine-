import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class FixDb4 {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/code_search_db", "root", "1206,#Www7");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("DESCRIBE repositories");
        while (rs.next()) {
            System.out.println(rs.getString("Field") + " | " + rs.getString("Null") + " | " + rs.getString("Default"));
        }
    }
}
