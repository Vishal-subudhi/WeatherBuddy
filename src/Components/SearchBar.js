import React,{useState} from 'react'

export default function SearchBar({onSearch}) {
    const [q,setQ]= useState("");

    const submit=(e)=>{
        e.pervertDefault();
        if(!q.trim()) return;
        onSearch(q.trim());
        setQ("");
    };
    
    return(
       <form onSubmit={submit} style={{display: "flex",gap: 8}}>
        <input
          className="search-input"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder='Search City...'
        />
       </form> 
    );
}