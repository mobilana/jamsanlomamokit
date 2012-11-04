// @author     Mobilana, <dev@mobilana.mobi>
// @copyright  (c) 2012 Mobilana Ltd, All Rights Reserved
//
//    Licensed under the @license License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//         http://xxx
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License
//
var flex = {
   
   //
   // includes template module
   include: function(mod)
   {
      for(p in mod)
         flex[p] = mod[p]
   },
   
   //
   //
   bind: function(def, ctx)
   {
      if (ctx)
      {
         if (typeof def == 'string')
            return function() {return whiskers.render(flex[def], ctx, flex)};
         //if (typeof def == 'object')
         //   return function() {return whiskers.render(def, ctx, flex)};
      } else {
         if (typeof def == 'string')
            return function() {return whiskers.render(flex[def], {}, flex)};
         //if (typeof def == 'object')
         //   return function() {return whiskers.render(def, {}, flex)};
      }
   },
   
   
   //
   // render ui definition
   xhtml: function(def, ctx) {
      if (typeof def == "object")
      {
         //ui definition carries on both context & ui def
         return whiskers.render(flex[def.flex], def, flex);
      }
      
      if (typeof def == "string")
      {
         ctx = ctx || {}
         return whiskers.render(flex[def], ctx, flex);
      }
   }
};


//
// Localization
//
// flex handles localization through an object of type 'l10n'
// {type: 'l10n', en:'...', ru:'...', ...}
// 
flex.lang = 'en';
flex.defaultLang = 'en';
(function(){
   var toString = Object.prototype.toString;

   Object.prototype.toString = function()
   {
      if (this.type == 'l10n')
      {
         if (this[flex.lang]) return this[flex.lang];
         if (this[flex.defaultLang]) return this[flex.defaultLang];
      } else {
         return toString(this);
      }
   }
}());

//
// ui (not compatible with ie60)
// 
HTMLSelectElement.prototype.select = function(value)
{
   var i = this.options.length;
   while(i)
   {
      if(this.options[--i].value == value)
      {
         this.selectedIndex = i;
         return;
      }
   };   
}

HTMLSelectElement.prototype.selectedText = function()
{
   var i = this.selectedIndex;
   return this.options[i].text;
}

HTMLSelectElement.prototype.selectedValue = function()
{
   var i = this.selectedIndex;
   return this.options[i].value;
}



//
//
flex.context = {
   check : function(){
      
      var e = document.body;
      var c = function(klass){
         e.className = e.className + ' ' + klass;
      };
      flex.context.season(c);
   },
   
   season: function(c)
   {
      var d = new Date();
      switch (d.getMonth())
      {
      case  0: //Jan 
         c('winter');
         break;
      case  1: //Feb
         c('winter');
         break;
      case  2: //Mar
         c('spring');
         break;
      case  3: //Apr
         c('spring');
         break;
      case  4: //May
         c('spring');
         break;
      case  5: //Jun
         c('summer');
         break;
      case  6: //Jul
         c('summer');
         break;
      case  7: //Aug
         c('summer');
         break;
      case  8: //Sep
         c('autumn');
         break;
      case  9: //Oct
         c('autumn');
         break;
      case 10: //Nov
         c('autumn');
         break;
      case 11: //Dec 
         c('winter');
         break;
      }
   }
};

//
// light event management
//
flex.event = function(){
   
   //
   // Configures action handler
   document.addEvent('click', function(e) 
   {
      try 
      {
         var el = (e.target.localName == 'a') ? e.target : e.target.getParent('a');
         if (el && el.__click)
            if (el.__click(el))
               e.preventDefault();   
      } catch (err) {
         
      };
    });
   
   return {};
};



//
// common ui elements
//
flex.common = {
   
l1col:' \
<div class="view {flex_class}" id="{id}" title="{title}" focused="{flex_focused}"> \
   {>header} \
   <div class="main"> \
      <div class="viewport"> \
         {$content} \
      </div> \
   </div> \
   {>footer} \
</div> \
',

lncol:' \
<div class="view {flex_class}" id="{id}" title="{title}" focused="{flex_focused}"> \
   {>header} \
   <div class="main"> \
      <div class="viewport"> \
         <div class="cols"> \
         {for c in column} \
            <div class="col {c.flex_class}" id="{c.id}">{$c.content}</div> \
         {/for} \
         </div> \
      </div> \
   </div> \
   {>footer} \
</div> \
',

popup:'\
<div class="view popup" id="{id}"> \
   {$content} \
</div> \
',

header:'\
<div class="toolbar header"> \
   {for a in header.action} \
      <a class="action" id="{a.id}" href="{a.rel}">{a.title}</a> \
   {/for} \
   {if title}<h1>{title}</h1>{/if}\
   {>mainmenu} \
</div> \
',



//
// Common Widgets
//
list:'\
<ul class="list {flex_class}"> \
{for e in entry} \
   {if e.flex} \
      {$e.flex} \
   {else} \
      {if flexEntry} \
         {$flexEntry} \
      {else} \
         {>li_content} \
      {/if}\
   {/if} \
{/for} \
</ul> \
',

li_content:'\
<li class="{e.flex_class}" id="{e.id}"> \
   <a href="{e.rel}"> \
      {if e.tag}<small>{e.tag}</small>{/if} \
      {if e.icon}<img src="{e.icon}">{/if} \
      <div> \
         {if e.type}<span>{e.type}</span>{/if} \
         <big>{e.title}</big> \
         {if e.subtitle}<span>{e.subtitle}</span>{/if} \
      </div> \
      {for text in e.summary} \
      <p>{text}</p> \
      {/for} \
   </a> \
</li> \
',

li_image:'\
<li> \
<div class="image {e.flex_class}" id="{e.id}"> \
   {if e.rel} \
      <a href="{e.rel}"> \
         {if e.title} \
            <span><div>{e.title}</div></span> \
         {/if} \
         <img src="{e.source}" alt="{e.title}" /> \
      </a> \
   {else} \
      <img src="{e.source}" alt="{e.title}" /> \
   {/if} \
</div> \
</li> \
'

};
             
//
// web
//
flex.web = {

editor:' \
<form class="editor" id="{id}" action="{flex_action}" method="{flex_method}"> \
{for e in entry} \
   {if e.flex} \
      {$e.flex} \
   {else} \
      {if flexEntry} \
         {$flexEntry} \
      {/if}\
   {/if} \
{/for} \
</form> \
',

choice: '\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
   <select name="{e.id}"> \
      {for opt in e.option} \
      <option value="{opt.id}">{opt.title}</option> \
      {/for} \
   </select> \
</div> \
',

checkbox: '\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
<input name="{e.id}" type="checkbox" placeholder="{e.hint}" checked="{e.value}" {if e.requred}required{/if} > \
</div> \
',

number: '\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
<input name="{e.id}" type="range" placeholder="{e.hint}" min="{e.min}" max="{e.max}" value="{e.value}" {if e.requred}required{/if} > \
</div> \
',

string: '\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
<input name="{e.id}" type="text" placeholder="{e.hint}" value="{e.value}" {if e.requred}required{/if} > \
</div> \
',

email:'\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
<input name="{e.id}" type="email" placeholder="{e.hint}" value="{e.value}" {if e.requred}required{/if} > \
</div> \
',

submit:'\
<div id="{e.id}" class="{e.flex_class}"> \
<label>{e.property}<small>{e.tag}</small></label> \
<input name="{e.id}" type="submit" value="{e.value}"> \
</div> \
'
};


//
// desktop 
//
flex.desktop = { 

footer:'\
<div class="toolbar footer"> \
   <div class="label rights">{footer.rights}</div> \
   <div class="label author">{footer.author}</div> \
</div> \
'

};




