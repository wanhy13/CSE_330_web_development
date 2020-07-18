$(document).ready(function(){
    $('.delete-post').on('click', function(e){
      $target = $(e.target);
      
      const id = $target.attr('data-id');
      $.ajax({
        type:'DELETE',
        url:'/posts/'+id,
        success: function(response){
            alert('Deleting Post');
            window.location.href='/';
        },
        error:function(err){
            console.log(err);
        }
      });
    });
  });

  $(document).ready(function(){
    $('.likeit').on('click', function(e){
      $target = $(e.target);
      
      const id = $target.attr('data-id');
      $.ajax({
        type:'POST',
        url:'/posts/likeit/'+id,
        success: function(response){
            alert('Like It');
            window.location.href='/posts/'+response.id;
        },
        error:function(err){
            console.log(err);
        }
      });
    });
  });

  $(document).ready(function(){
    $('.unlikeit').on('click', function(e){
      $target = $(e.target);
      
      const id = $target.attr('data-id');
      $.ajax({
        type:'POST',
        url:'/posts/unlikeit/'+id,
        success: function(response){
            alert('Unlike it');
            window.location.href='/posts/'+response.id;
        },
        error:function(err){
            console.log(err);
        }
      });
    });
  });


  $(document).ready(function(){
    $('.deletecomment').on('click', function(e){
      $target = $(e.target);
      
      const id = $target.attr('data-id');
      $.ajax({
        type:'DELETE',
        url:'/comments/'+id,
        success: function(response){
            alert('Delete it');
            window.location.href='/posts/'+response.id;
        },
        error:function(err){
            console.log(err);
        }
      });
    });
  });


