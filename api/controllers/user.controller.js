export const test = (req,res)=>{
    res.json({message : "api toute is working"});
};

export const update = async(req,res,next) =>{
    try{

    }catch(err){
        next(err);
    }
}