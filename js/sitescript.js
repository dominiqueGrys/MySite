current_section = "";


$(function(){
  var path = window.location.pathname;
  var page = path.split("/").pop().split(".")[0];
  console.log( page );
  current_section = page;

    console.log("good afternon!");
    history.pushState({'pageState': current_section}, current_section);

    $('.nav_item').click(function(e){
        var clicked_nav = e.target.getAttribute('name').slice(3, e.target.getAttribute('name').length);
        if(clicked_nav == current_section){
            return;
        }

        current_section = clicked_nav;
        console.log("current_section is "+current_section);
        $("#chk1").prop('checked', false);
        history.pushState({'pageState': current_section}, current_section);

        Render();
    });

    Render();
  });

  function Render(){
    // $('.content_item').hide();
    // $("#"+current_section).show();
  }

  window.addEventListener('popstate', (event) => {
    current_section = event.state.pageState;
    Render();
  });


