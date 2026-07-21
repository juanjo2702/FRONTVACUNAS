import{r as v,s as $,a as K,f as _,aN as M,K as e,k as s,O as z,j as n,P as d,g as U,Q as u,aR as c,aT as Y,aQ as Z,L as G,aO as J,aP as W,Y as y,i as X,aK as tt}from"./index.fd384d32.js";import{Q as T}from"./QItemSection.0230d9fb.js";import{b as at,a as D}from"./QItemLabel.020eee69.js";import{Q as ot}from"./QList.caf33543.js";import{Q as S}from"./QTd.cd94c0c9.js";import{Q as et}from"./QTr.ab53c280.js";import{a as st}from"./QTable.ff7ff139.js";import{L as f}from"./leaflet-src.e7b257a0.js";import{E as nt,a as it}from"./jspdf.plugin.autotable.14c7c909.js";import{u as lt}from"./use-quasar.76191f02.js";import"./QSelect.e4bd0d3f.js";import"./format.7ddebdfa.js";import"./_commonjsHelpers.b8add541.js";const rt={class:"pagina-no-vacunados q-pa-md"},ct={class:"header-container q-mb-md"},dt={class:"row items-center justify-between q-col-gutter-md"},ut={class:"col-12 col-md-4 text-right"},pt={class:"row justify-end q-gutter-sm"},mt={class:"stats-container q-mb-md"},gt={class:"row q-col-gutter-md"},vt={class:"col-12 col-sm-4"},ft={class:"text-h5 text-blue-9"},bt={class:"col-12 col-sm-4"},xt={class:"text-h5 text-orange-9"},ht={class:"col-12 col-sm-4"},_t={class:"text-h5 text-green-9"},yt={class:"map-container row q-col-gutter-md"},wt={class:"col-12 col-lg-9"},Pt={key:0,class:"map-loading flex flex-center"},Ct={class:"column items-center"},kt={class:"map-legend q-pa-sm"},qt={class:"row items-center q-gutter-x-sm"},$t={class:"col-12 col-lg-3"},Ot={__name:"PaginaMapaNoVacunados",setup(Mt){const p=lt(),{appContext:L}=U(),N=L.config.globalProperties.$api,i=v([]),m=v(!0),w=v(!1);v(null),v([{label:"Todas las zonas",value:null},{label:"Norte",value:"norte"},{label:"Sur",value:"sur"},{label:"Este",value:"este"},{label:"Oeste",value:"oeste"},{label:"Centro",value:"centro"}]);let l=null,g=[];const E=[{name:"nombre",label:"Propietario",field:t=>x(t),sortable:!0},{name:"mascotas",label:"Mascotas",field:t=>t.mascotas?t.mascotas.length:0,sortable:!0}],P=$(()=>i.value.reduce((t,o)=>t+(o.mascotas?o.mascotas.length:0),0)),b=$(()=>i.value.filter(t=>t.latitud&&t.longitud).length),I=$(()=>[{label:"\xDAltimos datos",value:new Date().toLocaleDateString(),color:"primary"},{label:"Cobertura",value:b.value>0?`${Math.round(b.value/i.value.length*100)}% de propietarios mapeados`:"No hay datos de ubicaci\xF3n",color:"orange"},{label:"Promedio",value:i.value.length>0?`${(P.value/i.value.length).toFixed(1)} mascotas por propietario`:"No hay datos",color:"teal"}]);function x(t){var o,a;return`${((o=t.persona)==null?void 0:o.nombres)||""} ${((a=t.persona)==null?void 0:a.apellidos)||""}`.trim()||"Sin nombre"}function F(){l&&l.remove(),l=f.map("map").setView([-17.3935,-66.157],12),f.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{attribution:'\xA9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',maxZoom:19}).addTo(l),f.control.scale({imperial:!1}).addTo(l)}function V(){g.length&&(g.forEach(t=>l.removeLayer(t)),g=[])}function B(t){V();const o=[];t.forEach(a=>{var r,h;if(a.latitud&&a.longitud){const C=x(a),k=a.mascotas?a.mascotas.map(q=>`
            <div class="popup-mascota">
              <div class="popup-mascota-nombre">${q.nombre}</div>
              <div class="popup-mascota-info">${q.especie} - ${q.raza||"Raza no especificada"}</div>
            </div>
          `).join(""):"<div>No hay informaci\xF3n de mascotas</div>",A=f.divIcon({className:"custom-div-icon",html:'<div class="marker-pin"></div><i class="material-icons">pets</i>',iconSize:[30,42],iconAnchor:[15,42]}),R=`
        <div class="custom-popup">
          <h4>${C}</h4>
          <p class="popup-subtitle">Mascotas sin vacunar:</p>
          <div class="popup-mascotas-container">
            ${k}
          </div>
          <div class="popup-footer">
            <div class="popup-contacto">
              ${(r=a.persona)!=null&&r.telefono?`<div><i class="material-icons popup-icon">phone</i> ${a.persona.telefono}</div>`:""}
              ${(h=a.persona)!=null&&h.ci?`<div><i class="material-icons popup-icon">badge</i> CI: ${a.persona.ci}</div>`:""}
            </div>
          </div>
        </div>
      `,H=f.marker([a.latitud,a.longitud],{icon:A}).addTo(l).bindPopup(R);g.push(H),o.push([a.latitud,a.longitud])}}),o.length>0&&l.fitBounds(o,{padding:[50,50]})}async function Q(){m.value=!0;try{const{data:t}=await N.get("/propietarios-no-vacunados");i.value=t,l||F(),B(t),p.notify({type:"positive",message:"Datos actualizados correctamente",position:"bottom-right",timeout:2e3})}catch(t){console.error("Error al obtener datos del backend:",t),p.notify({type:"negative",message:"Error al cargar los datos. Intente nuevamente.",position:"bottom-right"}),i.value=[]}finally{m.value=!1}}function j(t){t.latitud&&t.longitud?(l.setView([t.latitud,t.longitud],15),g.forEach(o=>{const a=o.getLatLng();a.lat===t.latitud&&a.lng===t.longitud&&o.openPopup()})):p.notify({type:"warning",message:"Este propietario no tiene ubicaci\xF3n registrada",position:"bottom-right"})}function O(){w.value=!0,setTimeout(()=>{try{const t=new nt;t.setFontSize(18),t.setTextColor(0,51,153),t.text("Propietarios con Mascotas Sin Vacunar",14,15),t.setFontSize(10),t.setTextColor(100,100,100),t.text(`Generado el: ${new Date().toLocaleDateString()}`,14,22),t.setFontSize(12),t.setTextColor(0,0,0),t.text(`Total de propietarios: ${i.value.length}`,14,30),t.text(`Total de mascotas sin vacunar: ${P.value}`,14,36),t.text(`Propietarios mapeados: ${b.value}`,14,42);const o=i.value.map(a=>{const r=x(a),h=a.mascotas?a.mascotas.length:0,C=a.mascotas?a.mascotas.map(k=>k.nombre).join(", "):"-";return[r,h,C,a.latitud||"-",a.longitud||"-"]});it(t,{head:[["Propietario","Cant. Mascotas","Nombres Mascotas","Latitud","Longitud"]],body:o,startY:50,theme:"grid",headStyles:{fillColor:[0,102,204]},alternateRowStyles:{fillColor:[240,240,240]}}),t.save("PropietariosNoVacunados.pdf"),p.notify({type:"positive",message:"PDF generado correctamente",position:"bottom-right",timeout:2e3})}catch(t){console.error("Error al generar PDF:",t),p.notify({type:"negative",message:"Error al generar el PDF",position:"bottom-right"})}finally{w.value=!1}},500)}return K(()=>{Q();const t=document.createElement("style");t.textContent=`
    .custom-popup {
      max-width: 250px;
      padding: 5px;
    }
    .custom-popup h4 {
      margin: 0 0 5px 0;
      color: #2c3e50;
    }
    .popup-subtitle {
      font-weight: bold;
      margin: 5px 0;
      color: #34495e;
    }
    .popup-mascotas-container {
      margin-bottom: 10px;
    }
    .popup-mascota {
      padding: 5px 0;
      border-bottom: 1px dashed #eee;
    }
    .popup-mascota:last-child {
      border-bottom: none;
    }
    .popup-mascota-nombre {
      font-weight: bold;
      color: #1976D2;
    }
    .popup-mascota-info {
      font-size: 0.9em;
      color: #555;
    }
    .popup-footer {
      margin-top: 10px;
      font-size: 0.9em;
      color: #666;
    }
    .popup-contacto {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .popup-icon {
      font-size: 14px;
      vertical-align: middle;
      margin-right: 3px;
    }
    .marker-pin {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      background: #c30b82;
      position: absolute;
      transform: rotate(-45deg);
      left: 50%;
      top: 50%;
      margin: -15px 0 0 -15px;
    }
    .marker-pin::after {
      content: '';
      width: 24px;
      height: 24px;
      margin: 3px 0 0 3px;
      background: #fff;
      position: absolute;
      border-radius: 50%;
    }
    .custom-div-icon i {
      position: absolute;
      width: 22px;
      font-size: 22px;
      left: 0;
      right: 0;
      margin: 10px auto;
      text-align: center;
      color: #c30b82;
      z-index: 1;
    }
  `,document.head.appendChild(t)}),(t,o)=>(_(),M("div",rt,[e("div",ct,[e("div",dt,[o[0]||(o[0]=e("div",{class:"col-12 col-md-8"},[e("div",{class:"text-h4 text-primary q-mb-xs"},"Mapa de Propietarios con Mascotas Sin Vacunar"),e("p",{class:"text-body1 text-grey-8 q-ma-none"}," Este mapa muestra la ubicaci\xF3n de propietarios que tienen mascotas pendientes de vacunaci\xF3n. Haga clic en los marcadores para ver m\xE1s detalles. ")],-1)),e("div",ut,[e("div",pt,[s(z,{label:"Descargar PDF",color:"primary",icon:"download",onClick:O,loading:w.value,unelevated:"",class:"q-px-md"},null,8,["loading"]),s(z,{label:"Actualizar Datos",color:"secondary",icon:"refresh",onClick:Q,loading:m.value,outline:""},null,8,["loading"])])])])]),e("div",mt,[e("div",gt,[e("div",vt,[s(d,{class:"stats-card bg-blue-1"},{default:n(()=>[s(u,{class:"text-center"},{default:n(()=>[e("div",ft,c(i.value.length),1),o[1]||(o[1]=e("div",{class:"text-subtitle1 text-blue-8"},"Propietarios",-1))]),_:1})]),_:1})]),e("div",bt,[s(d,{class:"stats-card bg-orange-1"},{default:n(()=>[s(u,{class:"text-center"},{default:n(()=>[e("div",xt,c(P.value),1),o[2]||(o[2]=e("div",{class:"text-subtitle1 text-orange-8"},"Mascotas sin vacunar",-1))]),_:1})]),_:1})]),e("div",ht,[s(d,{class:"stats-card bg-green-1"},{default:n(()=>[s(u,{class:"text-center"},{default:n(()=>[e("div",_t,c(b.value),1),o[3]||(o[3]=e("div",{class:"text-subtitle1 text-green-8"},"Ubicaciones mapeadas",-1))]),_:1})]),_:1})])])]),e("div",yt,[e("div",wt,[s(d,{class:"map-card"},{default:n(()=>[s(u,{class:"q-pa-none"},{default:n(()=>[m.value?(_(),M("div",Pt,[e("div",Ct,[s(Y,{color:"primary",size:"3em"}),o[4]||(o[4]=e("div",{class:"q-mt-sm text-primary"},"Cargando datos del mapa...",-1))])])):Z("",!0),o[7]||(o[7]=e("div",{id:"map",class:"mapa"},null,-1)),e("div",kt,[o[6]||(o[6]=e("div",{class:"text-caption text-weight-medium q-mb-xs"},"Leyenda",-1)),e("div",qt,[s(G,{name:"room",color:"red",size:"sm"}),o[5]||(o[5]=e("span",{class:"text-caption"},"Propietarios con mascotas sin vacunar",-1))])])]),_:1})]),_:1})]),e("div",$t,[s(d,{class:"info-card"},{default:n(()=>[s(u,null,{default:n(()=>[o[8]||(o[8]=e("div",{class:"text-h6 q-mb-md"},"Informaci\xF3n",-1)),s(ot,{separator:""},{default:n(()=>[(_(!0),M(J,null,W(I.value,(a,r)=>(_(),X(at,{key:r},{default:n(()=>[s(T,{avatar:""},{default:n(()=>[s(tt,{color:a.color,"text-color":"white",icon:"info"},null,8,["color"])]),_:2},1024),s(T,null,{default:n(()=>[s(D,null,{default:n(()=>[y(c(a.label),1)]),_:2},1024),s(D,{caption:""},{default:n(()=>[y(c(a.value),1)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}),o[9]||(o[9]=e("div",{class:"q-mt-lg"},[e("div",{class:"text-subtitle2 q-mb-sm"},"Informaci\xF3n adicional"),e("p",{class:"text-caption q-ma-none"}," Para m\xE1s detalles sobre campa\xF1as de vacunaci\xF3n, contacte a la oficina de Zoonosis. ")],-1))]),_:1})]),_:1}),s(d,{class:"list-card q-mt-md"},{default:n(()=>[s(u,{class:"q-pa-none"},{default:n(()=>[s(st,{title:"Propietarios",rows:i.value,columns:E,"row-key":"id",dense:"",pagination:{rowsPerPage:5},loading:m.value},{body:n(a=>[s(et,{props:a,onClick:r=>j(a.row),class:"cursor-pointer hover-highlight"},{default:n(()=>[s(S,{key:"nombre",props:a},{default:n(()=>[y(c(x(a.row)),1)]),_:2},1032,["props"]),s(S,{key:"mascotas",props:a},{default:n(()=>[y(c(a.row.mascotas?a.row.mascotas.length:0),1)]),_:2},1032,["props"])]),_:2},1032,["props","onClick"])]),_:1},8,["rows","loading"])]),_:1})]),_:1})])])]))}};export{Ot as default};
