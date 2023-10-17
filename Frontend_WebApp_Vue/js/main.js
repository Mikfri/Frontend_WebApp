/*Vi laver en enkelt app for hele Web-applikationen.. Derfor IKKE 
    const <appnavn> = Vue.createApp({...*/

/// CORS:
/// Cross Origin Resource Sharing, is an HTTP-header based mechanism that allows
/// a server to indicate any origins (domain, scheme, ...)


const baseUrl = "https://restexcercise2.azurewebsites.net/api/Book"
//const baseUrl = "http://anbo-bookstorerest.azurewebsites.net/api/books"         // BAD CORS
//const baseUrl = "https://anbo-restbookquerystring.azurewebsites.net/api/Books"  // GOOD CORS


Vue.createApp({
    data() {
        return {
            bookList: [],
            byTitle: "",
            singleBook: null,
            addData: { title: "", price: null },
            updData: { id: null, title: "", price: null },
            getAllStatMsg: "",
            getByTitStatMsg: "",
            delStatMsg: "",
            addStatMsg: "",
            updStatMsg: "",
            getIdStatMsg: "",
        }
    },
    methods: {
        clearOutput() {
            this.bookList = []
            this.singleBook = null
            this.getAllStatMsg = ""
            this.getByTitStatMsg = ""
            this.delStatMsg = ""
            this.addStatMsg = ""
            this.updStatMsg = ""
            this.getIdStatMsg = ""
        },
        async getAllBooks() {
            try {
                //this.clearOutput(); // Nulstil output før ny hentning
                const response = await axios.get(baseUrl);
                this.bookList = await response.data;
                this.getAllStatMsg = `CODE ${response.status}: ${response.statusText}`
            } catch (ex) {
                //this.getAllStatMsg = `ERROR: ${ex.message}`;
                alert(ex.message)
            }
        },
        async getByTitle(title) {
            try {
                const url = baseUrl + "?title=" + title;
                this.clearOutput();
                const response = await axios.get(url);
                this.bookList = response.data;

                //I mange API'er er det almindeligt at returnere en tom liste ([]) som et gyldigt svar, når ingen elementer opfylder kriterierne.
                if (this.bookList.length > 0) {
                    this.getByTitStatMsg = `CODE ${response.status}: ${response.statusText}`;
                } else {
                    this.getByTitStatMsg = `CODE 404: Not Found`;
                }
            } catch (ex) {
                this.getByTitStatMsg = `ERROR: ${ex.message}`;
                alert(ex.message);
            }
        },
        async helperGetAndShow(url) { // helper metode: getAllBook + getByAuthor are very similar
            try {
                const response = await axios.get(url)
                this.bookList = await response.data
            } catch (ex) {
                alert(ex.message) // https://www.w3schools.com/js/js_popup.asp
            }
        },
        async getById(id) {
            const url = baseUrl + "/" + id
            try {
                const response = await axios.get(url)
                this.singleBook = await response.data
                this.getIdStatMsg = `CODE ${response.status}: ${response.statusText}`
            } catch (ex) {
                this.getIdStatMsg = `ERROR: ${ex.message}`;
                alert(ex.message)
            }
        },
        async addBook() {
            try {
                response = await axios.post(baseUrl, this.addData)
                this.addStatMsg = `CODE ${response.status}: ${response.statusText}`
                this.getAllBooks()
            } catch (ex) {
                //this.addStatMsg = `ERROR: ${ex.message}`;
                alert(ex.message)
            }
        },
        // async addBook() {
        //     try {
        //         const response = await axios.post(baseUrl, this.addData)

        //         if (response.status === 201) {
        //             // Status 201: Created
        //             this.addStatMsg = `CODE ${response.status}: Created`
        //         } else if (response.status === 200) {
        //             // Status 200: OK, men forventet var 201
        //             this.addStatMsg = "Error: Expected status 201 Created, but received 200 OK"
        //         } else {
        //             this.addStatMsg = `CODE ${response.status}: ${response.statusText}`
        //         }

        //         this.getAllBooks();
        //     } catch (ex) {
        //         // Håndtering af fejl
        //         this.addStatMsg = `ERROR: ${ex.message}`
        //     }
        // },
        async updateBook(id) {       // ok kode
            const url = baseUrl + "/" + id
            try {
                const response = await axios.put(url, this.updData)
                this.updStatMsg = `CODE ${response.status}: ${response.statusText}`
                this.getById(id); // Opdaterer oplysningerne efter opdatering
                this.getAllBooks()
            } catch (ex) {
                alert(ex.message)     //Hvad vil vi ha'? Pop-up eller fejlbesked?
                this.updStatMsg
            }
        },
        async deleteBook(id) {
            const url = baseUrl + "/" + id
            try {
                response = await axios.delete(url)
                this.delStatMsg = `CODE ${response.status}: ${response.statusText}`
                this.getAllBooks()
            } catch (ex) {
                alert(ex.message)
            }
        },
        //---: DØD KODE, REF OG IDÉER :---
        // async updateBook() {
        //     const url = baseUrl + "/" + this.updData.id
        //     try {
        //         response = await axios.put(url, this.updData)
        //         this.updStatMsg = "CODE " + response.status + ": " + response.statusText
        //         this.getAllBooks()
        //     } catch (ex) {
        //         alert(ex.message)
        //     }
        // },
        // getStatusColor(status) {
        //     if (status >= 200 && status < 300) {
        //         return "text-success";
        //     } else if (status >= 300 && status < 400) {
        //         return "text-info";
        //     } else if (status >= 400 && status < 500) {
        //         return "text-warning";
        //     } else if (status >= 500) {
        //         return "text-danger";
        //     } else {
        //         return "text-dark";
        //     }
        // },
    }
}).mount("#app")