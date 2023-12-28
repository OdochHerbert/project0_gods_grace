$(document).ready(function() {
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })

  $('.modalBtn').on('click',function(){
    let ID = $(this).data('id')
    console.log(ID)
    
    $('#'+ID).show()
     
})

$('.closeBtn').on('click',function(){
  let ID = $(this).data('id')
  console.log(ID)
  
  $('#'+ID).hide()
})


$('.btn1').on('click',function(){
  let ID = $(this).data('id1')
  console.log(ID)
  
  $('#'+ID).toggle()
   
})





  $('.out').on('click',function(){
    const ID = $(this).data('id');
    const ID1 = $(this).data('id1');
    const ID2= $(this).data('id2');
    console.log(ID)

    $('#'+ID).show()
    $('#'+ID1).hide()
    $('#'+ID2).show()

  })

  $('.in').on('click',function(){
    const ID = $(this).data('id');
    const ID1 = $(this).data('id1');
    const ID2= $(this).data('id2');

    $('#'+ID).hide()
    $('#'+ID1).show()
    //$('#'+ID2).show()

  })
  
    function processForm( e ){
      const postId = $(this).data('id');
      const commentId = $(this).data('id1');
      const divId= $(this).data('id2');
      const showId= $(this).data('id5');
      const fatherId= $(this).data('id6');
      const smallId= $(this).data('id7');
      const parent=$(this).closest('div').attr('id')
      console.log(parent)
      console.log(divId)
      console.log(commentId)
      console.log('ITS ME')
        $.ajax({
            url: '/posts/'+postId+'/comments/'+commentId+'/replies',
            dataType: 'text',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: $(this).serialize(),
            success: function( data, textStatus, jQxhr ){
             
            



           
             
              

               
           $("#"+divId).load(location.href + " #"+divId +">*",function(responseTxt,statusTxt, xhr){
           
             if(statusTxt=='success'){
            

                $('.modal1').hide()
console.log('done')
               
                $('#'+showId).show()
                $('#'+smallId).show()
                
            $('.modalBtn').on('click',function(){
                let ID = $(this).data('id')
                console.log(ID)
                
                $('#'+ID).show()
                 
        })
        
       
        $('.closeBtn').on('click',function(){
            $('.modal1').hide()
        })


        $('.out').on('click',function(){
          const ID = $(this).data('id');
          const ID1 = $(this).data('id1');
          const ID2= $(this).data('id2');
          console.log(ID)
      
          $('#'+ID).show()
          $('#'+ID1).hide()
          $('#'+ID2).show()
      
        })
      
        $('.in').on('click',function(){
          const ID = $(this).data('id');
          const ID1 = $(this).data('id1');
          const ID2= $(this).data('id2');
      
          $('#'+ID).hide()
          $('#'+ID1).show()
          //$('#'+ID2).show()
      
        })
        //$('.form').submit( processForm );
        $('.form1').submit( processForm );

        


       
       
  
  
        //REFFRESH FORM FROM HERE   FROM ITS DIV ID  
         //  $("#"+divId).load(location.href + " #"+divId +">*",)
            }
           
          
               
        
                
              
             
           })
           
            /*
           $('.btn4').on('click',function(){
            let ID = $(this).data('id2')
            let ID1 = $(this).data('id3')
            console.log(ID)
        
          
            $('#'+ID).toggle()
  
          })
  
  */
 


  
 
 //$('#'+showId).show()
 //$('#'+fatherId).show()
 //$('#'+smallId).show()
                  
                  
                  
                 
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });
  
        e.preventDefault();
    }
  
    $('.form').submit( processForm );
   $('.form1').submit( processForm );



   function processForm4( e ){
    const Id = $(this).data('id0');
    console.log(Id)
    console.log('ITS ME')
      $.ajax({
          url: '/posts/'+Id+'/notify',
          dataType: 'text',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          data: $(this).serialize(),
          success: function( data, textStatus, jQxhr ){
           

             
        
          },
          error: function( jqXhr, textStatus, errorThrown ){
              console.log( errorThrown );
          }
      });
     

      
  }

  $('.cantos').submit( processForm4 );

  function processForm5( e ){
    
    const notIds = $(this).data('id');
    const user = $(this).data('id2');
    console.log('ITS ME')
    
   
      $.ajax({
          url: '/posts/viewed/'+user+'/'+notIds,
          dataType: 'text',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          data: $(this).serialize(),
          success: function( data, textStatus, jQxhr ){
           

             
        
          },
          error: function( jqXhr, textStatus, errorThrown ){
              console.log( errorThrown );
          }
      });
     

      
  }


  $('.power').on('click', processForm5 );

  function processForm6( e ){
    
    const commentId= $(this).data('id0');
    const authorId= $(this).data('id1');
    console.log(authorId)
    console.log('ITS ME')
    
    
   
      $.ajax({
          url: '/posts/save/'+commentId+'/'+authorId,
          dataType: 'text',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          data: $(this).serialize(),
          success: function( data, textStatus, jQxhr ){
           

             
        
          },
          error: function( jqXhr, textStatus, errorThrown ){
              console.log( errorThrown );
          }
      });
     

      
  }


  $('.commenter').on('click', processForm6 );







  


   //VOTING SYSTEM
   $('.vote-up').submit(function(e) {
    e.preventDefault();

    const postId = $(this).data('id');
    console.log(postId)
    $.ajax({
      type: 'PUT',
      url: '/posts/' + postId + '/vote-up',
      success: function(data) {
        alert(data);
      },
      error: function(err) {
        console.log(err.messsage);
      }
    });
    $('.vote-up').hide()
  });

  $('.vote-down').submit(function(e) {
      
    e.preventDefault();
    console.log('working')

    const postId = $(this).data('id');
    $.ajax({
      type: 'PUT',
      url: '/posts/' + postId + '/vote-down',
      success: function(data) {
       alert(data);
      },
      error: function(err) {
        console.log(err.messsage);
      }
    });
    $('.vote-down').hide()
  });
  
   
  
  
     
  
    })
      