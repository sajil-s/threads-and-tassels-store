import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarDays, ChevronDown, Check, ChevronLeft, ChevronRight, Eye, Users, AlertCircle } from "lucide-react";
import api from "../../services/api";

const LIMIT = 10;
const periods = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];
const colors = ["#F2D9C9", "#E0E9D8", "#EADAF4", "#F8DEDB", "#D5EAF0", "#F4E6C8"];
const indiaParts = () => {
  const values = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map(({type,value})=>[type,value]));
  return { year: +values.year, month: +values.month, day: +values.day };
};
const dateString = (y,m,d) => `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const today = () => { const {year,month,day}=indiaParts(); return dateString(year,month,day); };
function dateRange(period, start, end) {
  const {year,month,day} = indiaParts();
  if (period === "today") return {startDate: today(),endDate:today()};
  if (period === "week") return {startDate:new Date(Date.UTC(year,month-1,day-6)).toISOString().slice(0,10),endDate:today()};
  if (period === "month") return {startDate:dateString(year,month,1),endDate:today()};
  if (period === "custom") return {startDate:start,endDate:end};
  return {};
}
const displayDate = value => value ? new Date(value).toLocaleDateString("en-IN", {timeZone:"Asia/Kolkata", day:"2-digit",month:"short",year:"numeric"}) : "—";
const initials = name => (name || "User").trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()).join("");

function PeriodPicker({period,setPeriod}) {
  const [open,setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    const outside = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    const escape = e => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",escape);
    return () => {document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[]);
  return <div ref={root} className="relative z-20 w-full sm:w-auto">
    <button type="button" aria-label="Filter users by joining date" aria-expanded={open} onClick={()=>setOpen(v=>!v)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#EAE2D8] bg-white px-4 py-2.5 text-sm font-medium text-[#4A2E1F] shadow-sm transition hover:border-[#C77E77] sm:w-auto">
      <CalendarDays size={17} className="text-[#C77E77]"/><span>{periods.find(x=>x.value===period)?.label}</span><ChevronDown size={16} className={`transition-transform duration-200 ${open?"rotate-180":""}`}/>
    </button>
    {open && <div className="absolute right-0 top-[calc(100%+8px)] w-full min-w-[220px] overflow-hidden rounded-2xl border border-[#EAE2D8] bg-white p-2 shadow-[0_18px_40px_rgba(74,46,31,0.15)] sm:w-[240px]">
      <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A7A7A5]">Joining date</p>
      {periods.map(option=><button type="button" key={option.value} onClick={()=>{setPeriod(option.value);setOpen(false);}} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[#FFF5EE] ${period===option.value?"bg-[#FFF0E9] font-semibold text-[#A65E58]":"text-[#4A2E1F]"}`}><span>{option.label}</span>{period===option.value&&<Check size={16}/>}</button>)}
    </div>}
  </div>;
}

export default function AdminUsers() {
  const [users,setUsers] = useState([]);
  const [searchInput,setSearchInput] = useState("");
  const [search,setSearch] = useState("");
  const [period,setPeriod] = useState("all");
  const [customStart,setCustomStart] = useState("");
  const [customEnd,setCustomEnd] = useState("");
  const [page,setPage] = useState(1);
  const [pagination,setPagination] = useState({totalUsers:0,totalPages:0});
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const invalidRange = period==="custom" && (!customStart || !customEnd || customStart>customEnd || customEnd>today());
  const range = dateRange(period,customStart,customEnd);
  useEffect(()=>{const timer=setTimeout(()=>{setPage(1);setSearch(searchInput.trim());},350);return ()=>clearTimeout(timer);},[searchInput]);
  useEffect(()=>{setPage(1);},[period,customStart,customEnd]);
  useEffect(()=>{
    if(invalidRange){setLoading(false);return;}
    let active=true;
    async function load(){setLoading(true);setError("");try{
      const {data}=await api.get("/auth/admin/users",{params:{page,limit:LIMIT,...(search?{search}:{}),...range}});
      if(!active)return;
      setUsers(data.users||[]);setPagination(data.pagination||{totalUsers:0,totalPages:0});
    }catch(err){if(active){setError(err.response?.data?.message||"Unable to load users.");setUsers([]);setPagination({totalUsers:0,totalPages:0});}}
    finally{if(active)setLoading(false);}}
    load();return()=>{active=false;};
  },[page,search,period,customStart,customEnd,invalidRange]);
  const total=pagination.totalUsers||0;
  const first=total?(page-1)*LIMIT+1:0;
  const last=Math.min(page*LIMIT,total);
  const maxPage=Math.max(1,pagination.totalPages||0);
  return <div className="min-h-screen bg-[#FFF9F2] pb-10 text-[#4A2E1F]">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p><h1 className="font-serif text-3xl sm:text-4xl">Users</h1><p className="mt-2 text-sm text-[#8B817A]">Manage your customers and their details.</p></div>
      {/* <PeriodPicker period={period} setPeriod={setPeriod}/> */}
    </div>
    {period==="custom"&&<div className="mb-5 flex flex-wrap gap-3 rounded-2xl border border-[#EAE2D8] bg-white p-4">
      <label className="min-w-[145px] flex-1 text-xs font-medium">From<input type="date" value={customStart} max={today()} onChange={e=>setCustomStart(e.target.value)} className="mt-2 block w-full rounded-xl border border-[#EAE2D8] bg-[#FFF9F2] p-2.5 text-sm outline-none focus:border-[#C77E77]"/></label>
      <label className="min-w-[145px] flex-1 text-xs font-medium">To<input type="date" value={customEnd} min={customStart||undefined} max={today()} onChange={e=>setCustomEnd(e.target.value)} className="mt-2 block w-full rounded-xl border border-[#EAE2D8] bg-[#FFF9F2] p-2.5 text-sm outline-none focus:border-[#C77E77]"/></label>
      {invalidRange&&<p className="w-full text-xs text-red-600">Select a valid date range to view users.</p>}
    </div>}
    <label className="relative mb-4 block w-full sm:max-w-xl"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A7A7A5]"/><input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Search by name or email..." className="w-full rounded-xl border border-[#EAE2D8] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#C9A46A]"/></label>
    <section className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] shadow-[0_5px_20px_rgba(74,46,31,0.04)]">
      {error&&<div role="alert" className="m-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18}/>{error}</div>}
      {loading?<div className="space-y-3 p-5">{Array.from({length:6},(_,i)=><div key={i} className="h-14 animate-pulse rounded-xl bg-[#FFF0DB]/60"/>)}</div>:invalidRange?<div className="p-12 text-center text-sm text-[#8B817A]">Choose a valid date range.</div>:users.length===0?<div className="flex flex-col items-center gap-3 px-5 py-16 text-center"><Users size={35} className="text-[#C9A46A]"/><p className="font-medium">No users found</p><p className="text-sm text-[#8B817A]">Try a different search or date range.</p></div>:<>
        <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-[#FFF5EB] text-xs text-[#8B817A]"><tr>{["Name","Email","Phone","Role","Joined","Action"].map(col=><th key={col} className="px-5 py-4 font-medium">{col}</th>)}</tr></thead><tbody>{users.map((user,index)=><tr key={user._id} className="border-t border-[#EAE2D8] transition hover:bg-[#FFF9F2]">
          <td className="px-5 py-3"><div className="flex items-center gap-3"><span style={{backgroundColor:colors[index%colors.length]}} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">{initials(user.fullName)}</span><span className="max-w-[180px] truncate font-medium">{user.fullName}</span></div></td>
          <td className="max-w-[230px] truncate px-5 py-3 text-[#786B61]">{user.email}</td><td className="whitespace-nowrap px-5 py-3 text-[#786B61]">{user.phone||"—"}</td>
          <td className="px-5 py-3"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${user.role==="admin"?"bg-[#E7F5E8] text-[#34754A]":"bg-[#F0E7FF] text-[#74569B]"}`}>{user.role==="admin"?"Admin":"User"}</span></td>
          <td className="whitespace-nowrap px-5 py-3 text-[#786B61]">{displayDate(user.createdAt)}</td>
          <td className="px-5 py-3"><Link to={`/admin/users/${user._id}`} className="inline-flex items-center gap-2 rounded-xl border border-[#EAE2D8] bg-white px-3 py-2 text-xs font-medium transition hover:border-[#C9A46A]"><Eye size={15}/> View</Link></td>
        </tr>)}</tbody></table></div>
        <div className="divide-y divide-[#EAE2D8] md:hidden">{users.map((user,index)=><div key={user._id} className="flex items-start gap-3 p-4"><span style={{backgroundColor:colors[index%colors.length]}} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold">{initials(user.fullName)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.fullName}</p><p className="truncate text-xs text-[#8B817A]">{user.email}</p><p className="mt-1 text-xs text-[#8B817A]">{user.phone||"No phone"} · {displayDate(user.createdAt)}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${user.role==="admin"?"bg-[#E7F5E8] text-[#34754A]":"bg-[#F0E7FF] text-[#74569B]"}`}>{user.role==="admin"?"Admin":"User"}</span></div><Link to={`/admin/users/${user._id}`} aria-label={`View ${user.fullName}`} className="rounded-lg border border-[#EAE2D8] bg-white p-2"><Eye size={17}/></Link></div>)}</div>
      </>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE2D8] px-4 py-4 text-xs text-[#8B817A] sm:px-5"><span>Showing {first}–{last} of {total} users</span><div className="flex items-center gap-2"><button type="button" disabled={loading||page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronLeft size={16}/></button><span className="min-w-16 text-center font-medium text-[#4A2E1F]">{page} / {maxPage}</span><button type="button" disabled={loading||page>=maxPage} onClick={()=>setPage(p=>Math.min(maxPage,p+1))} aria-label="Next page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronRight size={16}/></button></div></div>
    </section>
  </div>;
}
