export function getSidoData(db, sidoName) { //시도별 미세먼지, 초미세먼지 가능. db에 예보 db를 넣어도 작동
    let [pm, fpm] = [-1, -1]
    const thisSido = db.find(sido => sido.sidoName === sidoName );

    if (thisSido !== undefined) {
        pm = thisSido.pm
        fpm = thisSido.fpm
    }
    
    return [pm, fpm]
}

export function getSigunguData(db, sidoName, sigunguName) {
    let [pm, fpm] = [-1, -1]
    const thisSido = db.find(sido => sido.sidoName === sidoName)
    
    if (thisSido !== undefined) {
        const thisSigungu = thisSido.data.find(sigungu => sigungu.sigunguName === sigunguName)
        if (thisSigungu !== undefined) {
            pm = thisSigungu.pm
            fpm = thisSigungu.fpm
        }
    }

    return [pm, fpm]
}