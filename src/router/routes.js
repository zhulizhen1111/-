const routes = [{ // author
    path: '/author',
    name: 'author',
    component: () => import('views/author')
},
{
    path: '/login',
    name: 'login',
    component: () => import('views/login')
},
{
    path: '/checkPwd',
    name: 'checkPwd',
    component: () => import('views/checkPwd')
},
{
    path: '/forgetPwd',
    name: 'forgetPwd',
    component: () => import('views/forgetPwd')
}, {
    path: '/changeProject',
    name: 'changeProject',
    component: () => import('views/changeProject')
}, {
    path: '/',
    name: 'first',
    component: () => import('views/first')
}, {
    path: '/risk',
    name: 'risk',
    component: () => import('views/risk')
},
{
    path: '/progress',
    name: 'progress',
    component: () => import('views/progress')
},
{
    path: '/detail',
    name: 'detail',
    component: () => import('views/detail')
},
{
    path: '/logout',
    name: 'logout',
    component: () => import('views/logout')
},
// { //repairs-record 
// 	path: '/repairsRecord',
// 	name: 'repairsRecord',
// 	component: () => import('views/repairs/repairs-record')
// },{
// 	path: '/repairDetail',
// 	name: 'repairDetail',
// 	component: () => import('views/repairs/repairs-record/repairDetail')
// },{
// 	path: '/personInfo',
// 	name: 'personInfo',
// 	component: () => import('views/repairs/repairs-record/personInfo')
// },{
// 	path: '/evaluate',
// 	name: 'evaluate',
// 	component: () => import('views/repairs/repairs-record/evaluate')
// },{ // my-evaluate 
// 	path: '/myEvaluate',
// 	name: 'myEvaluate',
// 	component: () => import('views/repairs/my-evaluate')
// },
{ // 404 
    path: '*',
    name: 'nofound',
    component: () => import('views/nofound')
},
]


export default routes
