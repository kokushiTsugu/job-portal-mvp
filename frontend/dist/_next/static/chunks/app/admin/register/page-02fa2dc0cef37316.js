(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[266],{9191:(e,t,a)=>{Promise.resolve().then(a.bind(a,404))},404:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>n});var s=a(5155),r=a(2115),l=a(6046);function n(){let[e,t]=(0,r.useState)(""),[a,n]=(0,r.useState)(""),[o,d]=(0,r.useState)(""),[u,i]=(0,r.useState)(""),m=(0,l.useRouter)(),c=async t=>{t.preventDefault(),i("");try{let t=await fetch("http://localhost:8080/admin/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:a,name:o})}),s=await t.json();if(!t.ok)throw Error(s.message||"管理者登録に失敗しました。");s.token&&localStorage.setItem("adminToken",s.token),"admin"===s.role?m.push("/admin/dashboard"):m.push("/mypage")}catch(e){i("エラー: "+e.message)}};return(0,s.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center text-gray-900",children:(0,s.jsxs)("div",{className:"w-full max-w-sm bg-white shadow-lg rounded-lg p-6",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold mb-6 text-center",children:"管理者登録"}),u&&(0,s.jsx)("p",{className:"text-red-500 text-sm mb-4",children:u}),(0,s.jsxs)("form",{onSubmit:c,className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"管理者名 (任意)"}),(0,s.jsx)("input",{type:"text",className:"w-full border border-gray-300 rounded px-3 py-2",value:o,onChange:e=>d(e.target.value),placeholder:"太郎 管理者"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"メールアドレス"}),(0,s.jsx)("input",{type:"email",className:"w-full border border-gray-300 rounded px-3 py-2",value:e,onChange:e=>t(e.target.value),placeholder:"admin@example.com"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"パスワード"}),(0,s.jsx)("input",{type:"password",className:"w-full border border-gray-300 rounded px-3 py-2",value:a,onChange:e=>n(e.target.value),placeholder:"********"})]}),(0,s.jsx)("button",{type:"submit",className:"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded",children:"登録"})]})]})})}},6046:(e,t,a)=>{"use strict";var s=a(6658);a.o(s,"useParams")&&a.d(t,{useParams:function(){return s.useParams}}),a.o(s,"usePathname")&&a.d(t,{usePathname:function(){return s.usePathname}}),a.o(s,"useRouter")&&a.d(t,{useRouter:function(){return s.useRouter}})}},e=>{var t=t=>e(e.s=t);e.O(0,[441,517,358],()=>t(9191)),_N_E=e.O()}]);