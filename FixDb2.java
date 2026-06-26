import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class FixDb2 {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/code_search_db", "root", "1206,#Www7");
        Statement stmt = conn.createStatement();
        stmt.execute("DROP TABLE repositories");
        System.out.println("Table dropped successfully");
    }
}
