import mysql from "mysql";
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'task1_dhaval'
  });


import express from "express";
import multer from 'multer';
import fs from 'fs';


var uniquepath = Date.now();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, uniquepath + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage }).single('userfile')

const app = express();

app.use(express.urlencoded());
app.use(express.json());
// app.use('/xyz', express.static('upload'))
app.use("/public", express.static("public"));
app.use('/xyz', express.static('upload'));

app.get("/users" , (req,res)=>{
    // res.send("GET ROUTE CALLED")
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error){
                 res.status(401).send({msg:error , data:null})
        }
        else{
            res.status(200).send({msg:"success" , data:results})
        }
        
      });
})

app.post("/users" , (req,res)=>{
    // res.send("POST ROUTE CALLED")
    connection.query('INSERT INTO products SET ?', req.body, function (error, results, fields) {
        if (error){
            res.status(401).send({msg:error , data:null})
   }
   else{
       res.status(200).send({msg:"success" , data:results})
   }
});
       
})
app.delete("/users" , (req,res)=>{
    res.send("DELETE ROUTE CALLED")
})
app.put("/users" , (req,res)=>{
    res.send("PUT ROUTE CALLED")
});


app.get("/usershow" , (req,res)=>{
    // res.send("GET ROUTE CALLED")
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error){
            console.log(error);
                 res.status(401).send({msg:error , data:null})
        }
        else{
            // res.status(200).send({msg:"success" , data:results})
            console.log(results);
            res.render("showproduct.ejs", {data:results});
        }
        
      });
});
app.get("/adduser" , function(req,res){
    res.render("addproduct.ejs");
});

app.post("/useradd" , (req,res)=>{
    // res.send("POST ROUTE CALLED")
    console.log(req.body);
    connection.query('INSERT INTO products SET ?', req.body, function (error, results, fields) {
        if (error){
            res.status(401).send({msg:error , data:null})
   }
   else{
    //    res.status(200).send({msg:"success" , data:results})
    res.redirect("/usershow");
    
   }
});
       
})

app.get("/userform", (req,res)=>{
    res.render('userformpage.ejs')
});

// app.post("/file-upload-action", (req, res)=>{
//     // console.log('test');
//     // console.log(req.body);

//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//         console.log(err, "Multer Error");

//       // A Multer error occurred when uploading.
//     } else if (err) {
//         console.log(err);
//       // An unknown error occurred when uploading.
//     }

//     var record = {
//         ...req.body,
//         userfile:req.file.filename
//     }
//     console.log(record);

//     console.log(req.file);
//     console.log(req.body);
//     // Everything went fine.

//     // res.send("File Upload Successfully");

//     connection.query('INSERT INTO products SET ?', record, function (error, results, fields) {
//         if (error) {
//             res.status(401).send({msg:error, data:null})
//         }
//         else{
//             // res.status(200).send({msg:"success", data:results})
//             res.redirect('/usershow')
//         }
//       });
//   })
// })
app.post("/file-upload-action", (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer Error:", err);
            return res.status(500).send({ msg: "Multer Error", data: null });
        } else if (err) {
            console.log("Unknown Error:", err);
            return res.status(500).send({ msg: "Unknown Error", data: null });
        }

        var record = {
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            userfile: req.file ? req.file.filename : null,
            description: req.body.description // Changed from req.file.description to req.body.description
        };

        connection.query('INSERT INTO products SET ?', record, function (error, results) {
            if (error) {
                console.error("Database Error:", error);
                return res.status(500).send({ msg: "Database Error", data: null });
            } else {
                return res.status(200).send({ msg: "File uploaded successfully", data: results });
            }
        });
    });
});





app.get("/viewuser" , function(req,res){
    // res.render("viewproduct.ejs");
    connection.query('SELECT * FROM products  ', function (error, results, fields) {
        if (error){
            console.log(error);
                 res.status(401).send({msg:error , data:null})
        }
        else{
            // res.status(200).send({msg:"success" , data:results})
            console.log(results);
            res.render("viewproduct.ejs", {data:results});
        }
        
      });
});

app.get("/product/:id", (req, res) => {
    const productId = req.params.id;
    connection.query('SELECT * FROM products WHERE id = ?', [productId], function (error, results) {
        if (error) {
            res.status(500).send({ msg: "Database query error", data: null });
        } else if (results.length > 0) {
            res.render("viewproduct.ejs", { data: results });
        } else {
            res.status(404).send({ msg: "Product not found", data: null });
        }
    });
});




// app.get("/product/delete/:id", (req, res) => {
//     const productId = req.params.id;
    
//     connection.query('DELETE FROM products WHERE id = ?', [productId], function (error, results) {
//         if (error) {
//             res.status(500).send({ msg: "Database query error", data: null });
//         } else if (results.affectedRows > 0) {
//             res.redirect('/usershow'); // Redirect to the product listing page after deletion
//         } else {
//             res.status(404).send({ msg: "Product not found", data: null });
//         }
//     });
// });

app.get("/product/delete/:id", (req, res) => {
    const productId = req.params.id;

    // Step 1: Retrieve the filename from the database
    connection.query('SELECT userfile FROM products WHERE id = ?', [productId], function (error, results) {
        if (error) {
            console.error("Database Error:", error);
            return res.status(500).send({ msg: "Database Error", data: null });
        }

        if (results.length > 0) {
            const productFile = results[0].userfile;

            // Step 2: Delete the file from the upload folder
            const filePath = `./upload/${productFile}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                    return res.status(500).send({ msg: "Failed to delete file", data: null });
                }

                console.log("File deleted successfully:", filePath);

                // Step 3: Delete the product from the database
                connection.query('DELETE FROM products WHERE id = ?', [productId], function (error, results) {
                    if (error) {
                        console.error("Database Error:", error);
                        return res.status(500).send({ msg: "Failed to delete product", data: null });
                    }

                    if (results.affectedRows > 0) {
                        // res.status(200).send({ msg: "Product and file deleted successfully", data: results });
                        res.redirect('/usershow');
                    } else {
                        res.status(404).send({ msg: "Product not found", data: null });
                    }
                });
            });
        } else {
            res.status(404).send({ msg: "Product not found", data: null });
        }
    });
});









app.listen(7000);