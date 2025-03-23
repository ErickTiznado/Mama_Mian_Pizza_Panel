import './kpicards.css';
import { TrendingUp } from 'lucide-react'

function kpicards(kpinfo){
return(
<>
    <div className='kpicard-container'>
        <header className='kpicard-header'>            
        <h5>
            {kpinfo.kpinfo.title}
        </h5>
        </header>
        <div className='kpicard-content'>
            <span className='kpicard-value'>
                ${kpinfo.kpinfo.value}
            </span>
            <p className='kpicard-description'>
                <TrendingUp color='green' />
                {kpinfo.kpinfo.description}
            </p>
        </div>
    </div>
</>
);
}

export default kpicards