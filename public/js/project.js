// $(function(){
//     console.log("called");
//     $("#add-user").click(function(ev){
//         ev.preventDefault();
//         var record = $("#add-user-form").serialize();
//         console.log(record);

//         $.ajax({
//             type: "POST",
//             url: "/useradd",
//             data: record,
//             success: function(response){
//                 console.log(response);
//                 window.location.href = '/usershow'; 
//             }
//         });

//     });
// });


    $(document).ready(function() {
        $('#add-user-form').on('submit', function(e) {
            e.preventDefault();

            var formData = new FormData(this);

            $.ajax({
                type: 'POST',
                url: '/file-upload-action',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    alert('Product uploaded successfully!');
                    window.location.href = '/usershow';  // Redirect to showproduct page
                },
                error: function(error) {
                    alert('Error uploading product');
                    console.log(error);
                }
            });
        });
    });




