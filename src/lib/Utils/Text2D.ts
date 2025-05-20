class Text2D {
    public static getTextMaxLength(texts: string[]): string {
        let lastText: string | null = null;
    
        texts.forEach(textA => {
            if(!lastText){
                lastText = textA;
            }
    
            texts.forEach(textB => {
                if(textA == textB || !lastText) return;
    
                if(lastText.length < textB.length){
                    lastText = textB.trim();
                }
            })
        })
    
        return lastText! as string;
    }
}

export { Text2D }
