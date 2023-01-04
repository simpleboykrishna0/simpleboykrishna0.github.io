#include <iostream>
#include "sqlite3.h" 
using namespace std;

int main(int argc, char* argv[]) {
   sqlite3 *db;
   char *zErrMsg = 0;
   int rc;

   rc = sqlite3_open("test.db", &db);

   if( rc ) {
       cout << "Content-type:text/html\r\n\r\n";
   cout << "Content-type:text/html\r\n\r\n";
   cout << "<html>\n";
   cout << "<head>\n";
   cout << "<title>Hello World - First CGI Program</title>\n";
   cout << "</head>\n";
   cout << "<body>\n";
   cout << "<h2>Error</h2>\n";
   cout << "</body>\n";
   cout << "</html>\n";
      //fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
      return(0);
   } else {
      cout << "Content-type:text/html\r\n\r\n";
   cout << "<html>\n";
   cout << "<head>\n";
   cout << "<title>Hello World - First CGI Program</title>\n";
   cout << "</head>\n";
   cout << "<body>\n";
   cout << "<h2>Success</h2>\n";
   cout << "</body>\n";
   cout << "</html>\n";
   
      //fprintf(stderr, "Opened database successfully\n");
   }
   sqlite3_close(db);
}