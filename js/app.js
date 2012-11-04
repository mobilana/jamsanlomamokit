//
// Application FSM
//
var fsm = {
   
   relang: false,
   is_cottages: false,
   is_desc: false,
   is_map: false,
   cdef: null,
   clist: null,
   
   //
   // 
   request: function(uri, evt)
   {
      new Request.JSON({
         url: uri,
         secure: false,
         onSuccess: function(json){
            if (!json)
               fsm.failure(uri);
            else
               evt(json);
            },
            onFailure: function(){
               fsm.failure(uri);
            }
      }).get();
   },
   
   failure: function(uri)
   {
      alert('Service is not available! Try again later');
   },
   
   req_lang: function(lang)
   {
      flex.lang = lang;
      fsm.is_cottages = false;
      fsm.is_desc = false;
      fsm.relang = true;
      $('doc').empty();
      fsm.req_application();
      
   },
   
   //
   //
   req_application: function()
   {
      if (!fsm.cdef)
         fsm.request('./js/app-def.json', fsm.ind_application);
      else
         fsm.ind_application(fsm.cdef);
   },
   
   ind_application: function(json)
   {
      fsm.cdef = json;
      app.widget.mainmenu = flex.xhtml(json.mainmenu);
      app.widget.booking  = flex.xhtml(json.booking);
      flex.include(app.widget);
   
      json.entry.each(
         function(v)
         {
            v.header  = json.header;
            v.footer  = json.footer;
            $('doc').innerHTML = $('doc').innerHTML + flex.xhtml(v);
         }
      )
      
      // gallery
      $('lightbox').addEvent('click', function(){
         $('lightbox').setStyle('display', 'none');
      });
      $('notification').addEvent('click', function(){
         $('notification').setStyle('display', 'none');
      });
      /* switch scale */
	   $('book_cottage').getElement('select').addEvent('change', function(e){
	      fsm.req_gallery($('book_cottage').getElement('select').selectedValue());
	   });
      
      //book
      $('booking').getElement('form').addEvent('submit', function(e){  
         e.preventDefault();   
         
         var valid = true;
         if ($('book_arrive').getElement('input').value == '')
         {
            $('book_arrive').addClass('required');
            valid = false;
         } else {
            $('book_arrive').removeClass('required');
         }
         if ($('book_duration').getElement('input').value == '')
         {
            $('book_duration').addClass('required');
            valid = false;
         } else {
            $('book_duration').removeClass('required');
         }
         if ($('book_name').getElement('input').value == '')
         {
            $('book_name').addClass('required');
            valid = false;
         }  else {
            $('book_name').removeClass('required');
         }
         if ($('book_phone').getElement('input').value == '')
         {
            $('book_phone').addClass('required');
            valid = false;
         }  else {
            $('book_phone').removeClass('required');
         }
         if ($('book_email').getElement('input').value == '')
         {
            $('book_email').addClass('required');
            valid = false;
         }  else {
            $('book_email').removeClass('required');
         }
         if (!valid)
         {
            return; 
         }
         
         (new Request.JSONP({
            url: 'http://jlm.eu01.aws.af.cm/book.php',
            onSuccess: function(){ 
               $('notification').setStyle('display', 'block');
               $('notification').getElement('a').innerHTML = {
                  type: 'l10n',
                  en: 'Thank you for your request!<br/>We will shortly contact you.',
                  ru: 'Спасибо за Ваш запрос!<br/>Мы вскоре свяжемся с вами.',
                  fi: 'Kiitos pyynnöstä! <br/> Otamme pian yhteyttä.'
               };
            },
            onFailure: function(){ alert('fail') }
         }).send({
            method: 'post',
            data: JSON.encode({
               cottage: $('book_cottage').getElement('select').selectedText(),
               arrive: $('book_arrive').getElement('input').value,
               duration: $('book_duration').getElement('input').value,
               person: $('book_name').getElement('input').value, 
               phone: $('book_phone').getElement('input').value,
               email: $('book_email').getElement('input').value
            })
         }));
         
      });
      
      if (fsm.relang)
      {
         fsm.req_cottage_list();
         fsm.relang = false;
      }
      $('root').addClass('running');
   },
   
   
   //
   //
   req_cottage_list: function()
   {
      if (!fsm.is_cottages)
         if (!fsm.clist)
            fsm.request('./content/cottages.json', fsm.ind_cottage_list);
         else
            fsm.ind_cottage_list(fsm.clist);
      else
         fsm.ind_cottage_list(null);
   },
   
   ind_cottage_list: function(json)
   {
      if (!fsm.is_cottages)
      {
         $('cottages').innerHTML = flex.xhtml(json);  
         fsm.is_cottages = true;
         fsm.clist = json;
      }
      $$('.view').each(function(ui){ui.setStyle('display', 'none')});
      $$('.col').each(function(ui){ui.setStyle('display', 'none')});
      $('home').setStyle('display', 'block');
      $('booking').setStyle('display', 'block');
      $('cottages').setStyle('display', 'block');
   },
   
   //
   //
   req_map: function()
   {
      if (!fsm.is_map)
      {
         var script = document.createElement("script");
         script.type = "text/javascript";
         script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=fsm.ind_map";
         document.body.appendChild(script);
      } else {
         fsm.ind_map();
      }
   },
   
   ind_map: function()
   {
      var lat = 61.953095;
      var lng = 25.024412;
      if (!fsm.is_map)
      {
         var latlng = new google.maps.LatLng(lat, lng);
         var myOptions = {
           zoom: 10,
           center: latlng,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         var map = new google.maps.Map(document.getElementById("maptile"),
             myOptions);
         
         var marker = new google.maps.Marker({
             position: latlng,
             title:"Jamsan Loma Mökit"
         });
         // To add the marker to the map, call setMap();
         marker.setMap(map);
         fsm.is_map = true;
      };
      $$('.col').each(function(ui){ui.setStyle('display', 'none')});
      $('booking').setStyle('display', 'block');
      $('col-map').setStyle('display', 'block');
   },
   
   //
   //
   req_gallery: function(id)
   {
      fsm.request('./content/' + id + '/feed.json', fsm.ind_gallery);
   },
   
   ind_gallery: function(json)
   {
      $('photos').innerHTML = flex.xhtml(json);
      $$('.col').each(function(ui){ui.setStyle('display', 'none')});
      $('booking').setStyle('display', 'block');
      $('photos').setStyle('display', 'block');
      $('book_cottage').getElement('select').select(json.id);
      
      // gallery process 
      $('photos').getElements('a').each(
         function(a)
         {
            a.addEvent('click', function(e){
               $('lightbox').getElement('img').src = a.href;
               $('lightbox').setStyle('display', 'block');
               e.preventDefault();
            })
         }
      );
      
   },
   
   //
   //
   req_desc: function()
   {
      if (!fsm.is_desc)
         fsm.request('./content/services.json', fsm.ind_desc);
      else
         fsm.ind_desc(null);
   },
   
   ind_desc: function(json)
   {
      if (!fsm.is_desc)
      {
         var c1 = JSON.parse(JSON.stringify(json));
         var c2 = json;
         delete c1.entry[2];
         delete c1.entry[1];
         delete c2.entry[3];
         delete c2.entry[0];
         $('col-desc-1').innerHTML = flex.xhtml('accomodation', c1);
         $('col-desc-2').innerHTML = flex.xhtml('accomodation', c2);
         fsm.is_desc = true;
      }
      $$('.col').each(function(ui){ui.setStyle('display', 'none')});
      $('booking').setStyle('display', 'block');
      $('col-desc-1').setStyle('display', 'block');
      $('col-desc-2').setStyle('display', 'block');
   }
};


var app = {};
//
// Application widgets
//
app.widget = {
   
fineart: ' \
<div class="season"> \
   <div> \
      <a href="#home">Jämsän Loma Mökit</a> \
   </div> \
</div> \
',

accomodation: '\
<div class="image img-rect"> \
<div></div> \
</div> \
{for e in entry} \
   <h3>{e.title}</h3> \
   {for txt in e.content} \
      <p>{txt}</p> \
   {/for} \
{/for} \
',

maptile: '\
<div id="maparea"><div id="maptile"></div></div> \
',

viewer:'\
<div class="image"><img src="" alt="" /></div> \
',

notification: ' \
<div class="season"> \
   <div> \
      <a></a> \
   </div> \
</div> \
'

};


//
//
//
function main()
{
   flex.context.check();
   flex.include(flex.common);
   flex.include(flex.web);
   flex.include(flex.desktop);
   
   fsm.req_application();

   document.addEvent('click', function(evt){
      var e = (evt.target.get('tag') == 'a') ? evt.target : evt.target.getParent('a');
      var a = e.hash.substr(1).split(".");
      
      switch (a[0])
      {
      case "home":
         fsm.req_cottage_list();
         evt.preventDefault();
         break;
      case "desc":
         fsm.req_desc();
         evt.preventDefault();
         break;
      case "map":
         fsm.req_map();
         evt.preventDefault();
         break;   
      case "gallery":
         fsm.req_gallery(a[1]);
         evt.preventDefault();
         break;   
      case "lang":
         fsm.req_lang(a[1]);
         evt.preventDefault();
         break;
      };
   });
   
}
