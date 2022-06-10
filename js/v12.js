function TI68kEmulatorCoreModule(stdlib){"use strict";var state=new Object();state.version=1;state.d0=0;state.d1=0;state.d2=0;state.d3=0;state.d4=0;state.d5=0;state.d6=0;state.d7=0;state.a0=0;state.a1=0;state.a2=0;state.a3=0;state.a4=0;state.a5=0;state.a6=0;state.a7=0;state.a8=0;state.sr=0;state.prev_pc=0;state.pc=0;state.pending_ints=0;state.address_error_access_type=0;state.address_error_address=0;state.current_instruction=0;state.reading_instruction=0;state.rom=false;state.ram=new Uint16Array(131072);var cpu=new Object();cpu.t=new Array(65536);cpu.n=new Array(65536);cpu.cycles=new Uint8Array(65536);state.unhandled_count=0;var main_interval_timer_id=0;state.main_interval_timer_interval=11;state.tracecount=0;state.cycle_count=0;state.overall=2500;state.osc2_counter=0;state.frames_counted=0;state.total_time=0;var newromready=false;var newfileready=false;var newflashfileready=false;var ui=false;var link=false;state.erase_ram_upon_reset=true;state.port_600000=0x04;state.vectorprotect=false;state.wakemask=0;state.lcd_address_high=9;state.lcd_address_low=0x80;state.lcd_address=0x4c00;state.screen_width=240;state.screen_height=128;state.interrupt_control=0x1B;state.interrupt_rate=0x200;state.timer_min=0xB2;state.timer_current=0;state.keystatus=new Uint8Array(80);state.keymaskhigh=0xFF;state.keymasklow=0xFF;state.port_60001A=0x02;state.port_60001B=0;state.port_60001C=0x01;state.port_60001D=0x8D;state.port_700017=0;state.port_70001D=0;state.port_70001F=0;state.stopped=false;state.hardware_model=1;state.calculator_model=1;state.pedrom=false;state.punix=false;state.jmp_tbl=0;state.ROM_base=0;state.FlashMemorySize=0;state.large_flash_memory=false;state.Protection_enabled=false;var enable_kludge_in_lea_d_pc_a0=true;state.hex_prefix="$";state.flash_write_ready=0;state.flash_write_phase=0x50;state.flash_ret_or=0;function save_state()
{var state=new Object();state.apiversion=apiversion();state.emu=_save_state();state.link=link._save_state();state.ui=ui._save_state();}
function _save_state()
{var emustate=new Object();return emustate;}
function restore_state(state)
{if(typeof(state)==="object"&&typeof(state.emu)==="object"&&typeof(state.link)==="object"&&typeof(state.ui)==="object"){stdlib.clearInterval(main_interval_timer_id);if(state.emu.apiversion!==apiversion){stdlib.console.log("API version has changed, funny results may occur...");}
_restore_state(state.emu);link._restore_state(state.link);ui._restore_state(state.ui);}
else{stdlib.console.log("Refusing to restore state from something not an object / from an object without the expected sub-objects");}}
function _restore_state(emustate)
{}
var hex_digits='0123456789ABCDEF';function to_hex(number,digits)
{var s="";if(number<0)
{number=-number;digits--;s="-";}
while(digits--)
{var digit=number%16;number=(number-digit)/16;s=hex_digits[digit]+s;}
return s;}
function to_hex2(number,digits)
{var s="";while(digits--)
{var digit=number&15;number=number>>4;s=hex_digits[digit]+s;}
return s;}
var rb_1_normal=function(address){return 0x14;}
var rb_1_flashspecial=function(address){return 0x14;}
var rw_1_normal=function(address){return 0x1400;}
var rw_1_flashspecial=function(address){return 0x1400;}
var wb_1_normal=function(address,value){}
var ww_1_normal=function(address,value){}
var ww_1_flashspecial=function(address,value){}
var rb_3_normal=function(address){return 0x14;}
var rb_3_flashspecial=function(address){return 0x14;}
var rw_3_normal=function(address){return 0x1400;}
var rw_3_flashspecial=function(address){return 0x1400;}
var wb_3_normal=function(address,value){}
var ww_3_normal=function(address,value){}
var ww_3_flashspecial=function(address,value){}
var rb_8_normal=function(address){return 0x14;}
var rb_8_flashspecial=function(address){return 0x14;}
var rw_8_normal=function(address){return 0x1400;}
var rw_8_flashspecial=function(address){return 0x1400;}
var wb_8_normal=function(address,value){}
var ww_8_normal=function(address,value){}
var ww_8_flashspecial=function(address,value){}
var rb_9_normal=function(address){return 0x14;}
var rb_9_flashspecial=function(address){return 0x14;}
var rw_9_normal=function(address){return 0x1400;}
var rw_9_flashspecial=function(address){return 0x1400;}
var wb_9_normal=function(address,value){}
var ww_9_normal=function(address,value){}
var ww_9_flashspecial=function(address,value){}
var rb=function(address){return 0x14;}
var rw=function(address){return 0x1400;}
var wb=function(address,value){}
var ww=function(address,value){}
function memory_dump(address,size,stride)
{address&=0xFFFFFF;size&=0xFFFFFF;stride&=0xFFFFFF;var end=address+size;var str=to_hex(address,6)+"\t";var i=0;while(address<end)
{if(i==stride){str+="\n"+to_hex(address,6)+"\t";i=0;}
str+=to_hex(rb(address),2)+" ";address++;i++;}
stdlib.console.log(str);}
function ROM_CALL(id)
{id&=0xFFFF;return rl(state.jmp_tbl+4*id);}
function HeapTable()
{if(state.pedrom&&state.ram[0x30>>>1]<=0x0080){return rl(0x5d58);}
else{if(ROM_CALL(-1)<0x441&&!state.pedrom){return rl(rw(ROM_CALL(0x96)+8));}
else{return ROM_CALL(0x441);}}}
function HeapDeref(id)
{id&=0xFFFF;return rl(HeapTable()+4*id);}
function HeapSizeAddress(address)
{if(!state.pedrom){return((rw(address-2)&0x7FFF)-1)<<1;}
else{if(address>=state.ROM_base){return rw(address)+2;}
else{return rl(address-6)-6;}}}
function HeapSize(id)
{id&=0xFFFF;return HeapSizeAddress(rl(HeapTable()+4*id));}
function PrintHeap()
{var address=HeapTable()+4;stdlib.console.log("0\tFFFFFF\tN/A");for(var i=1;i<2000;i++){var handle=rl(address);if(handle!=0){stdlib.console.log(i+"\t"+to_hex(handle,6)+"\t"+to_hex(HeapSizeAddress(handle),6));}
address+=4;}}
function disassemble_indexed_disp(disp)
{return((disp&0x8000)?"A":"D")+(((disp&0x7000)>>>12)&0x7)+((((disp&0x0800)>>>11)&1)?".L":".W")+")";}
function disassemble_regs_mask(regs8,prefix)
{var str="";var previous=0;var current;var start=-1;var end=-1;var i;for(i=0;i<8;i++){current=regs8&1;if(previous==0&&current==1)start=i;if(previous==1&&current==0)end=i-1;if(start==end&&start!=-1){str+=prefix+(i-1)+"/";end=-1;start=-1;}
else if(end>start){str+=prefix+start+"-"+prefix+end+"/";end=-1;start=-1;}
previous=current;regs8>>>=1;}
end=i-1;if(end>(start+1)&&start!=-1){str+=prefix+start+"-"+end;}
else if(start>0&&end>0){str+=prefix+start;}
else{str=str.substring(0,str.length-1);}
return str;}
function disassemble_regs_predec_mask(regs8,prefix)
{var str="";var previous=0;var current;var start=-1;var end=-1;var i;for(i=0;i<8;i++){current=(regs8&(1<<7))>>7;if(previous==0&&current==1)start=i;if(previous==1&&current==0)end=i-1;if(start==end&&start!=-1){str+=prefix+(i-1)+"/";end=-1;start=-1;}
else if(end>start){str+=prefix+start+"-"+prefix+end+"/";end=-1;start=-1;}
previous=current;regs8<<=1;}
end=i-1;if(end>(start+1)&&start!=-1){str+=prefix+start+"-"+end;}
else if(start>0&&end>0){str+=prefix+start;}
else{str=str.substring(0,str.length-1);}
return str;}
function disassemble(address,count)
{if(address&1){stdlib.console.log("Cowardly refusing to disassemble from an odd address");return;}
while(count>0){var opcode=rw(address);var rawinstr=cpu.n[opcode];var orig_address=address;var leftside;var rightside;var idx=rawinstr.indexOf(",");if(idx==-1){leftside=rawinstr;rightside="";}
else{leftside=rawinstr.substr(0,idx);rightside=rawinstr.substr(idx+1);}
address+=2;if(leftside!=""){if(leftside.indexOf("#xxxxxx")!=-1){leftside=leftside.replace("#xxxxxx","#"+state.hex_prefix+to_hex(rl(address),8));address+=4;}
else if(leftside.indexOf("#xxx")!=-1){leftside=leftside.replace("#xxx","#"+state.hex_prefix+to_hex(rw(address),4));address+=2;}
else if(leftside.indexOf("#xx")!=-1){leftside=leftside.replace("#xx","#"+state.hex_prefix+to_hex(rw(address)&0xFF,2));address+=2;}
else if(leftside.indexOf("xxx.W")!=-1){leftside=leftside.replace("xxx.W",state.hex_prefix+to_hex(rw(address),4)+".W");address+=2;}
else if(leftside.indexOf("xxx.L")!=-1){leftside=leftside.replace("xxx.L",state.hex_prefix+to_hex(rl(address),8)+".L");address+=4;}
else if(leftside.indexOf("d(A")!=-1){var disp=rw(address);if(rightside.indexOf("Dn)")==0){leftside=leftside.replace("d(A",state.hex_prefix+to_hex(disp&0xFF,2)+"(A");leftside+=","+disassemble_indexed_disp(disp);rightside=rightside.substring(4);}
else{leftside=leftside.replace("d(A",state.hex_prefix+to_hex(disp,4)+"(A");}
address+=2;}
else if(leftside.indexOf("d(PC")!=-1){var disp=rw(address);if(rightside.indexOf("Dn)")==0){leftside=leftside.replace("d(PC",state.hex_prefix+to_hex(disp&0xFF,2)+"(PC");leftside+=","+disassemble_indexed_disp(disp);rightside=rightside.substring(4);}
else{leftside=leftside.replace("d(PC",state.hex_prefix+to_hex(disp,4)+"(PC");}
address+=2;}
else if(leftside.indexOf(".W disp")!=-1){var disp=rw(address)+2;if(disp&0x8000){disp=0x10000-disp;leftside=leftside.replace("disp","-"+state.hex_prefix+to_hex(disp,4)+" ["+to_hex(orig_address-disp,6)+"]");}
else{leftside=leftside.replace("disp","+"+state.hex_prefix+to_hex(disp,4)+" ["+to_hex(orig_address+disp,6)+"]");}
address+=2;}
else if(leftside.indexOf(".S disp")!=-1){var disp=(opcode&0xFF)+2;if(disp&0x80){disp=0x100-disp;leftside=leftside.replace("disp","-"+state.hex_prefix+to_hex(disp,2)+" ["+to_hex(orig_address-disp,6)+"]");}
else{leftside=leftside.replace("disp","+"+state.hex_prefix+to_hex(disp,2)+" ["+to_hex(orig_address+disp,6)+"]");}}
else if(leftside.indexOf("regspredec")!=-1){var regsan=rb(address+1);var regsdn=rb(address);var str="";if(regsdn!=0){str=disassemble_regs_predec_mask(regsdn,"D");str+="/";}
if(regsan!=0){str+=disassemble_regs_predec_mask(regsan,"A");}
leftside=leftside.replace("regspredec",str);address+=2;}
else if(leftside.indexOf("regs")!=-1){var regsdn=rb(address+1);var regsan=rb(address);var str="";if(regsdn!=0){str=disassemble_regs_mask(regsdn,"D");str+="/";}
if(regsan!=0){str+=disassemble_regs_mask(regsan,"A");}
leftside=leftside.replace("regs",str);address+=2;}}
if(rightside!=""){if(rightside.indexOf("#xxx")!=-1){rightside=rightside.replace("#xxx","#"+state.hex_prefix+to_hex(rw(address),4));address+=2;}
else if(rightside.indexOf("xxx.W")!=-1){rightside=rightside.replace("xxx.W",state.hex_prefix+to_hex(rw(address),4)+".W");address+=2;}
else if(rightside.indexOf("xxx.L")!=-1){rightside=rightside.replace("xxx.L",state.hex_prefix+to_hex(rl(address),8)+".L");address+=4;}
else if(rightside.indexOf("d(A")!=-1){var disp=rw(address);if(rightside.indexOf(",Dn)")!=-1){rightside=rightside.replace("d(A",state.hex_prefix+to_hex(disp&0xFF,2)+"(A");rightside=rightside.replace("Dn)",disassemble_indexed_disp(disp));}
else{rightside=rightside.replace("d(A",state.hex_prefix+to_hex(disp,4)+"(A");}
address+=2;}
else if(rightside.indexOf("disp")!=-1){var disp=rw(address)+2;if(disp&0x8000){disp=0x10000-disp;rightside=rightside.replace("disp","-"+state.hex_prefix+to_hex(disp,4)+" ["+to_hex(orig_address-disp,6)+"]");}
else{rightside=rightside.replace("disp","+"+state.hex_prefix+to_hex(disp,4)+" ["+to_hex(orig_address+disp,6)+"]");}
address+=2;}
else if(rightside.indexOf("regs")!=-1){var regsdn=rb(address+1);var regsan=rb(address);var str="";if(regsdn!=0){str=disassemble_regs_mask(regsdn,"D");str+="/";}
if(regsan!=0){str+=disassemble_regs_mask(regsan,"A");}
rightside=rightside.replace("regs",str);address+=2;}
stdlib.console.log(to_hex(orig_address,6)+"\t"+leftside+","+rightside);}
else{stdlib.console.log(to_hex(orig_address,6)+"\t"+leftside);}
count--;}}
function print_status()
{stdlib.console.log('---')
var opcode=rw(state.pc);stdlib.console.log('PC='+to_hex(state.pc,9)+' SR='+to_hex(state.sr,4)+' opcode='+to_hex(opcode,4)+' '+cpu.n[opcode]);var a='';var d='';for(var r=0;r<8;r++){a+='A'+r+'='+to_hex(eval('state.a'+r),9)+' ';d+='D'+r+'='+to_hex(eval('state.d'+r),9)+' ';}
stdlib.console.log(d);stdlib.console.log(a);}
function print_status2()
{stdlib.console.log('---')
var opcode=rw(state.pc);for(var r=0;r<8;r++){stdlib.console.log('D'+r+'='+to_hex(eval('state.d'+r),9)+"\t"+'A'+r+'='+to_hex(eval('state.a'+r),9));}
stdlib.console.log('SR='+to_hex(state.sr,4)+"\tPC="+to_hex(state.pc,9));stdlib.console.log('T='+((state.sr&0x8000)>>>15)+"\tS="+((state.sr&0x2000)>>>13)+"\tM="+((state.sr&0x1000)>>>12)+"\tI="+((state.sr&0x0700)>>>8));stdlib.console.log('X='+((state.sr&0x0010)>>>4)+"\tN="+((state.sr&0x0008)>>>3)+"\tZ="+((state.sr&0x0004)>>>2)+"\tV="+((state.sr&0x0002)>>>1)+"\tC="+(state.sr&0x0001));stdlib.console.log('opcode='+to_hex(opcode,4)+"\t"+cpu.n[opcode]);}
function ebw(value)
{value=value&0xFF;return(value<=0x7F)?value:0xFF00+value;}
function ewl(value)
{value=value&0xFFFF;return(value<=0x7FFF)?value:4294901760+value;}
function subw(subtrahend,minuend)
{subtrahend&=0xFFFF;minuend&=0xFFFF;var complement=0x10000-subtrahend;var result=complement+minuend;var maskedresult=result>=0x10000?result-0x10000:result;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&0x8000)state.sr+=8;if(maskedresult<0)maskedresult+=0x10000;if(complement<0x8000&&minuend<0x8000&&maskedresult>=0x8000)state.sr+=2;if(complement>=0x8000&&minuend>=0x8000&&maskedresult<0x8000)state.sr+=2;if(subtrahend>minuend)state.sr+=0x11;return maskedresult;}
function cmpw(subtrahend,minuend)
{subtrahend&=0xFFFF;minuend&=0xFFFF;var complement=0x10000-subtrahend;var result=complement+minuend;var maskedresult=result>=0x10000?result-0x10000:result;state.sr&=0xFFF0;if(maskedresult==0)state.sr+=4;if(result&0x8000)state.sr+=8;if(maskedresult<0)maskedresult+=0x10000;if(complement<0x8000&&minuend<0x8000&&maskedresult>=0x8000)state.sr+=2;if(complement>=0x8000&&minuend>=0x8000&&maskedresult<0x8000)state.sr+=2;if(subtrahend>minuend)state.sr+=1;return maskedresult;}
function addw(x,y)
{x&=0xFFFF;y&=0xFFFF;var result=x+y;var maskedresult=result&0xFFFF;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&0x8000)state.sr+=8;if(result!=maskedresult)state.sr+=0x11;if(y<0x8000&&x<0x8000&&maskedresult>=0x8000)state.sr+=2;if(y>=0x8000&&x>=0x8000&&maskedresult<0x8000)state.sr+=2;return maskedresult;}
function subb(subtrahend,minuend)
{subtrahend&=0xFF;minuend&=0xFF;var complement=0x100-subtrahend;var result=complement+minuend;var maskedresult=result>=0x100?result-0x100:result;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&0x80)state.sr+=8;if(maskedresult<0)maskedresult+=0x100;if(complement<0x80&&minuend<0x80&&maskedresult>=0x80)state.sr+=2;if(complement>=0x80&&minuend>=0x80&&maskedresult<0x80)state.sr+=2;if(subtrahend>minuend)state.sr+=0x11;return maskedresult;}
function cmpb(subtrahend,minuend)
{subtrahend&=0xFF;minuend&=0xFF;var complement=0x100-subtrahend;var result=complement+minuend;var maskedresult=result>=0x100?result-0x100:result;state.sr&=0xFFF0;if(maskedresult==0)state.sr+=4;if(result&0x80)state.sr+=8;if(maskedresult<0)maskedresult+=0x100;if(complement<0x80&&minuend<0x80&&maskedresult>=0x80)state.sr+=2;if(complement>=0x80&&minuend>=0x80&&maskedresult<0x80)state.sr+=2;if(subtrahend>minuend)state.sr+=1;return maskedresult;}
function addb(x,y)
{x&=0xFF;y&=0xFF;var result=x+y;var maskedresult=result&0xFF;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&0x80)state.sr+=8;if(result!=maskedresult)state.sr+=0x11;if(y<0x80&&x<0x80&&maskedresult>=0x80)state.sr+=2;if(y>=0x80&&x>=0x80&&maskedresult<0x80)state.sr+=2;return maskedresult;}
function subl(subtrahend,minuend)
{var complement=4294967296-subtrahend;var result=complement+minuend;var maskedresult=result>=4294967296?result-4294967296:result;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&2147483648)state.sr+=8;if(maskedresult<0)maskedresult+=4294967296;if(complement<2147483648&&minuend<2147483648&&maskedresult>=2147483648)state.sr+=2;if(complement>=2147483648&&minuend>=2147483648&&maskedresult<2147483648)state.sr+=2;if(subtrahend>minuend)state.sr+=0x11;return maskedresult;}
function cmpl(subtrahend,minuend)
{var complement=4294967296-subtrahend;var result=complement+minuend;var maskedresult=result>=4294967296?result-4294967296:result;state.sr&=0xFFF0;if(maskedresult==0)state.sr+=4;if(result&2147483648)state.sr+=8;if(maskedresult<0)maskedresult+=4294967296;if(complement<2147483648&&minuend<2147483648&&maskedresult>=2147483648)state.sr+=2;if(complement>=2147483648&&minuend>=2147483648&&maskedresult<2147483648)state.sr+=2;if(subtrahend>minuend)state.sr+=1;return maskedresult;}
function addl(x,y)
{var result=x+y;var maskedresult=result>=4294967296?result-4294967296:result;state.sr&=0xFFE0;if(maskedresult==0)state.sr+=4;if(result&2147483648)state.sr+=8;if(result!=maskedresult)state.sr+=0x11;if(maskedresult<0)maskedresult+=4294967296;if(x<2147483648&&y<2147483648&&maskedresult>=2147483648)state.sr+=2;if(x>=2147483648&&y>=2147483648&&maskedresult<2147483648)state.sr+=2;return maskedresult;}
function sub(x,y,size)
{if(size==0)return subb(x,y);if(size==1)return subw(x,y);if(size==2)return subl(x,y);}
function cmp(x,y,size)
{if(size==0)return cmpb(x,y);if(size==1)return cmpw(x,y);if(size==2)return cmpl(x,y);}
function add(x,y,size)
{if(size==0)return addb(x,y);if(size==1)return addw(x,y);if(size==2)return addl(x,y);}
function abcd(x,y)
{var lowsum=(x&0xF)+(y&0xF);if(state.sr&0x10)lowsum++;var carrymid=0;if(lowsum>=10){lowsum-=10;carrymid=0x10;}
var highsum=(x&0xF0)+(y&0xF0)+carrymid;state.sr&=0xFFE4;if(highsum>=0xA0){highsum-=0xA0;state.sr|=0x11;}
var result=highsum+lowsum;if(result!=0)state.sr&=0xFFFB;return result;}
function sbcd(dst,src)
{src&=0xFF;dst&=0xFF;var subtrahend=(src>>>4)*10+(src&0xF);var minuend=(dst>>>4)*10+(dst&0xF);var result=minuend-subtrahend;if(state.sr&0x10)result--;state.sr&=0xFFE4;if(result<0){result=result+100;state.sr|=0x11;}
if(result!=0)state.sr&=0xFFFB;var lowdigit=result%10;var highdigit=(result-lowdigit)/10;var finalresult=highdigit*16+lowdigit;return finalresult;}
function nbcd(src)
{src&=0xFF;var result;if(state.sr&0x10){result=153-src;if(result<0)result+=256;}
else{result=154-src;if(result<0)result+=256;if(!(src&0xF)){result+=16;result&=0xF0;if(result==160||result==256)result=0;}}
state.sr&=0xFFE4;if(result&0x80)state.sr|=8;if(result!=0){state.sr&=0xFFFB;state.sr|=0x11;}
return result;}
function addx(x,y,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;var result=x+y;if(state.sr&0x10)result++;var maskedresult=result>=overflow?result-overflow:result;state.sr&=0xFFE0;if(result==0)state.sr|=4;if(result&neg)state.sr+=8;if(result!=maskedresult)state.sr+=0x11;if(maskedresult<0)maskedresult+=overflow;if(x<neg&&y<neg&&maskedresult>=neg)state.sr+=2;if(x>=neg&&y>=neg&&maskedresult<neg)state.sr+=2;return maskedresult;}
function subx(x,y,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;var result=y-x;if(state.sr&0x10)result--;state.sr&=0xFFE4;if(result<0)
{result+=overflow;state.sr|=0x11;}
if(result!=0)state.sr&=0xFFBF;if(result+result>=overflow)state.sr|=8;if(x>=neg&&y<neg&&result>=neg)state.sr|=2;if(x<neg&&y>=neg&&result<neg)state.sr|=2;return result;}
function muls(x,y)
{x=x&0xFFFF;y=y&0xFFFF;if(x>=0x8000)x-=0x10000;if(y>=0x8000)y-=0x10000;var product=x*y;state.sr&=0xFFF0;if(product<0){product+=4294967296;state.sr|=8;}
if(product==0)state.sr|=4;return product;}
function mulu(x,y)
{x=x&0xFFFF;y=y&0xFFFF;var product=x*y;state.sr&=0xFFF0;if(product>=2147483648)state.sr|=8;if(product==0)state.sr|=4;return product;}
function divu(divisor,dividend)
{if(divisor==0)fire_cpu_exception(5);divisor&=0xFFFF;var quotient=Math.floor(dividend/divisor)&4294967295;var remainder=(dividend%divisor)&0xFFFF;state.sr&=0xFFF0;if(quotient==0)state.sr|=4;if(quotient&4294901760){if(quotient>=2147483648)state.sr|=8;state.sr|=2;return dividend;}
if(quotient>0x10000||remainder>0x10000||quotient<0||remainder<0)stdlib.console.log("bad divide!");var result=quotient|(remainder<<16);if(result&0x8000)state.sr|=8;if(result<0)result+=4294967296;return result;}
function divs(divisor,dividend)
{divisor&=0xFFFF;if(divisor==0)fire_cpu_exception(5);var adivisor=divisor>=0x8000?divisor-0x10000:divisor;var adividend=dividend>=2147483648?dividend-4294967296:dividend;var quotient=Math.floor(adividend/adivisor)&4294967295;var remainder=(adividend%adivisor)&0xFFFF;state.sr&=0xFFF0;if(quotient>=2147483648)state.sr|=8;if(quotient==0)state.sr|=4;if(quotient>=0x8000||quotient<-32768){if(quotient>=2147483648)state.sr|=8;state.sr|=2;return dividend;}
if(quotient<0)quotient+=0x10000;if(remainder<0)remainder+=0x10000;var result=quotient+(remainder<<16);if(result<0)result+=4294967296;return result;}
function lsl(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFF0;while(shift>0)
{if(x&neg)state.sr|=0x11;else state.sr&=0xFFEE;x<<=1;if(x>=overflow){x-=overflow;}
shift--;}
x&=overflow-1;if(x&neg)state.sr|=8
if(x==0)state.sr|=4;return x;}
function asl(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFE1;if(shift>0)state.sr&=0xFFE0;while(shift>0)
{if(x&neg)state.sr|=0x11;else state.sr&=0xFFEE;var old=x;x<<=1;if(x>=overflow){x-=overflow;}
if((x&neg)!=(old&neg))state.sr|=2;shift--;}
x&=overflow-1;if(x&neg)state.sr|=8
if(x==0)state.sr|=4;return x;}
function lsr(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFE0;while(shift>0)
{if(x&1)state.sr|=0x11;else state.sr&=0xFFEE;x>>>=1;shift--;}
x&=overflow-1;if(x&neg)state.sr|=8
if(x==0)state.sr|=4;return x;}
function asr(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFF0;if(shift>0)state.sr&=0xFFEF;while(shift>0)
{if(x&1)state.sr|=0x11;else state.sr&=0xFFEE;if(x&neg){x>>>=1;x|=neg;}
else{x>>>=1;}
shift--;}
x&=overflow-1;if(x&neg)state.sr|=8
if(x==0)state.sr|=4;return x;}
function ror(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFF0;while(shift--)
{var out=x&1;x>>>=1;if(out)x=x+neg;}
x&=overflow-1;if(x&neg)state.sr|=0x9
if(x==0)state.sr|=4;return x;}
function rol(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFF0;while(shift>0)
{if(x&neg){x<<=1;x++;}
else{x<<=1;}
if(x>=overflow){x-=overflow;}
shift--;}
x&=overflow-1;if(x&neg)state.sr|=0x8;if(x&1)state.sr|=1;if(x==0)state.sr|=4;return x;}
function roxr(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;while(shift--)
{var out=x&1;x>>>=1;if(state.sr&0x10)x=x+neg;state.sr=state.sr&0xFFE0;if(out)state.sr+=0x10;}
x&=overflow-1;if(x&neg)state.sr|=0x9
if(x==0)state.sr|=4;if(state.sr&0x10)state.sr|=1;return x;}
function roxl(x,shift,size)
{var overflow=0x100;if(size==1)overflow=0x10000;if(size==2)overflow=4294967296;var neg=overflow/2;x&=overflow-1;state.sr&=0xFFF0;while(shift>0)
{var old=x;x<<=1;if(state.sr&0x10)x=x+1;if(old&neg){state.sr|=0x10;}
else{state.sr&=0xFFEF;}
if(x>=overflow){x-=overflow;}
shift--;}
x&=overflow-1;if(x&neg)state.sr|=0x8;if(state.sr&0x10)state.sr|=1;if(x==0)state.sr|=4;return x;}
function aline(){state.pc-=2;fire_cpu_exception(10);}
function fline(){state.pc-=2;fire_cpu_exception(11);}
function unhandled_instruction(){state.pc-=2;fire_cpu_exception(4);}
function update_sr(new_sr)
{if((new_sr^state.sr)&0x2000)
{var t=state.a7;state.a7=state.a8;state.a8=t;}
state.sr=new_sr&0xA71F;}
function an(reg)
{switch(reg){case 0:return state.a0;case 1:return state.a1;case 2:return state.a2;case 3:return state.a3;case 4:return state.a4;case 5:return state.a5;case 6:return state.a6;case 7:return state.a7;}}
function dn(reg)
{switch(reg){case 0:return state.d0;case 1:return state.d1;case 2:return state.d2;case 3:return state.d3;case 4:return state.d4;case 5:return state.d5;case 6:return state.d6;case 7:return state.d7;}}
var MODE_DREG=0;var MODE_AREG=1;var MODE_AREG_INDIRECT=2;var MODE_AREG_POSTINC=3;var MODE_AREG_PREDEC=4;var MODE_AREG_OFFSET=5;var MODE_AREG_INDEX=6;var MODE_MISC=7;var MISCMODE_SHORT=0;var MISCMODE_LONG=1;var MISCMODE_PC_OFFSET=2;var MISCMODE_PC_INDEX=3;var MISCMODE_IMM=4;var instruction_list=""
function insert_inst(opcode,code,name)
{instruction_list+="cpu.t["+opcode+"] = function() { "+code+"};";cpu.n[opcode]=name;}
function insert_inst2(opcode,code,name,count)
{instruction_list+="cpu.t["+opcode+"] = function() { "+code+"};";cpu.n[opcode]=name;cpu.cycles[opcode]=count;}
function valid_source(mode,reg)
{return mode<7||reg<=4}
function valid_dest(mode,reg)
{return mode<7||reg<=1}
function valid_calc_effective_address(mode,reg)
{return mode==MODE_AREG_INDIRECT||mode==MODE_AREG_OFFSET||mode==MODE_AREG_INDEX||(mode==MODE_MISC&&(reg<=3))}
function size_name(size)
{if(size==0)return".B"
if(size==1)return".W"
return".L"}
function get_read(size)
{if(size==0)return"rb"
if(size==1)return"rw"
if(size==2)return"rl"}
function get_write(size)
{if(size==0)return"wb"
if(size==1)return"ww"
if(size==2)return"wl"}
function amode_name(mode,reg,size)
{if(mode==MODE_DREG)return"D"+(reg)
if(mode==1)return"A"+(reg)
if(mode==2)return"(A"+(reg)+")"
if(mode==3)return"(A"+(reg)+")+"
if(mode==MODE_AREG_PREDEC)return"-(A"+(reg)+")"
if(mode==5)return"d(A"+(reg)+")"
if(mode==6)return"d(A"+(reg)+",Dn)"
if(mode==7&&reg==0)return"xxx.W"
if(mode==7&&reg==1)return"xxx.L"
if(mode==7&&reg==2)return"d(PC)"
if(mode==7&&reg==3)return"d(PC,Dn)"
if(mode==7&&reg==4){if(size==0)return"#xx";else if(size==1)return"#xxx";else if(size==2)return"#xxxxxx";}
return"unk"}
function size_imm(size)
{if(size==0)return" #xx,";else if(size==1)return" #xxx,";else if(size==2)return" #xxxxxx,";}
function read_pc(size,dest,sideeffects)
{if(size==0)
{var code="var "+dest+"=rb(state.pc+1);"
return sideeffects?code+"state.pc+=2;":code}
else if(size==1)
{var code="var "+dest+"=rw(state.pc);"
return sideeffects?code+"state.pc+=2;":code}
else if(size==2)
{var code="var "+dest+"=rl(state.pc);"
return sideeffects?code+"state.pc+=4;":code}}
function amode_read(mode,reg,size,sideeffects)
{var increment=size+1;if(increment==3)increment=4;if(increment==1&&reg==7)increment=2;if(mode==MODE_MISC&&reg==MISCMODE_IMM)
return read_pc(size,"s",sideeffects);if(mode==MODE_MISC&&reg==MISCMODE_PC_OFFSET)
{var code=read_pc(1,"o",sideeffects);code+="var a=state.pc+ewl(o)-2;"
code+="var s="+get_read(size)+"(a);"
return code;}
if(mode==MODE_MISC&&reg==MISCMODE_PC_INDEX)
{var code=read_pc(1,"e",sideeffects)
code+="var a=e&0xFF;"
code+="if(a>127)a-=256;"
code+="a+=state.pc-2;"
code+="var x=(e>>>12)&7;"
code+="var y=(e>32767)?an(x):dn(x);"
code+="if(!(e&0x800))y=ewl(y);"
code+="var s="+get_read(size)+"(y+a);"
return code;}
if(mode==MODE_MISC&&reg==MISCMODE_LONG)
{code=read_pc(2,"a",sideeffects)
code+="var s="+get_read(size)+"(a);"
return code;}
if(mode==MODE_MISC&&reg==MISCMODE_SHORT)
{code=read_pc(1,"a",sideeffects)
code+="var s="+get_read(size)+"(ewl(a));"
return code;}
if(mode==MODE_AREG_INDIRECT)
{return"var s="+get_read(size)+"(state.a"+reg+");"}
if(mode==MODE_AREG_POSTINC)
{var code="var s="+get_read(size)+"(state.a"+reg+");"
if(sideeffects)code+="state.a"+reg+"+="+increment+";"
return code;}
if(mode==MODE_AREG_PREDEC)
{if(sideeffects)
return"state.a"+reg+"-="+increment+";"+"var s="+get_read(size)+"(state.a"+reg+");"
else
return"var s="+get_read(size)+"(state.a"+reg+"-"+increment+");"}
if(mode==MODE_AREG_OFFSET)
{var code=read_pc(1,"o",sideeffects)
code+="var a=state.a"+reg+"+ewl(o);"
code+="var s="+get_read(size)+"(a);"
return code;}
if(mode==MODE_AREG_INDEX)
{var code=read_pc(1,"e",sideeffects)
code+="var a=e&255;"
code+="if (a>=128)a-=256;"
code+="a+=state.a"+reg+";"
code+="var x=(e>>>12)&7;"
code+="var y=(e>32767)?an(x):dn(x);"
code+="if(!(e&0x800))y=ewl(y);"
code+="var s="+get_read(size)+"(y+a);"
return code}
if(mode==MODE_DREG)
{if(size==0)
return"var s=state.d"+reg+"&255;"
if(size==1)
return"var s=state.d"+reg+"&65535;"
if(size==2)
return"var s=state.d"+reg+"; if(s<0)s+=4294967296; if(s>4294967295)s-=4294967296;"}
if(mode==MODE_AREG)
{if(size==1)
return"var s=state.a"+reg+"&65535;"
if(size==2)
return"var s=state.a"+reg+"; if(s<0)s+=4294967296; if(s>4294967295)s-=4294967296;"}
return"fire_cpu_exception(4);";}
function effective_address_calc(mode,reg)
{var code="fire_cpu_exception(4);"
if(mode==MODE_MISC&&reg==MISCMODE_PC_OFFSET)
{code=read_pc(1,"o",true)
code+="var z=state.pc-2+ewl(o);"
code+="if(z>4294967295)z-=4294967296;"}
if(mode==MODE_MISC&&reg==MISCMODE_PC_INDEX)
{code=read_pc(1,"e",true)
code+="var a=e&0xFF;"
code+="if(a>127)a-=256;"
code+="a+=state.pc-2;"
code+="var x=(e>>>12)&7;"
code+="var y=(e>32767)?an(x):dn(x);"
code+="if (!(e&0x800))y=ewl(y);"
code+="var z=y+a;"
code+="if(z>4294967295)z-=4294967296;"}
if(mode==MODE_AREG_INDEX)
{code=read_pc(1,"e",true)
code+="var a = e&0xFF;"
code+="if(a>127)a-=256;"
code+="a+=state.a"+reg+";"
code+="var x=(e>>>12)&7;"
code+="var y=(e>32767)?an(x):dn(x);"
code+="if (!(e&0x800))y=ewl(y);"
code+="var z=y+a;"
code+="if(z>4294967295)z-=4294967296;"}
if(mode==MODE_MISC&&reg==MISCMODE_LONG)
code=read_pc(2,"z",true)
if(mode==MODE_MISC&&reg==MISCMODE_SHORT)
{code=read_pc(1,"z",true)
code+="z=ewl(z);"}
if(mode==MODE_AREG_OFFSET)
{code=read_pc(1,"o",true)
code+="var z=state.a"+reg+"+ewl(o);"
code+="if(z>4294967295)z-=4294967296;"}
if(mode==MODE_AREG_INDIRECT)
code="var z=state.a"+reg+";"
return code}
function set_condition_flags_data(size,s)
{var code="state.sr &= 65520;"
code+="if("+s+"==0) state.sr += 4;"
if(size==0)return code+"if("+s+"&128) state.sr += 8;"
if(size==1)return code+"if("+s+"&32768) state.sr += 8;"
if(size==2)return code+"if("+s+"&2147483648) state.sr += 8;"}
function amode_write(mode,reg,size,data)
{var increment=size+1;if(increment==3)increment=4;if(increment==1&&reg==7)increment=2;if(mode==MODE_MISC&&reg==MISCMODE_LONG)
return"var addr = rl(state.pc); state.pc += 4; "+get_write(size)+"(addr,"+data+");"
if(mode==MODE_MISC&&reg==MISCMODE_SHORT)
return"var addr = ewl(rw(state.pc)); state.pc += 2; "+get_write(size)+"(addr,"+data+");"
if(mode==MODE_AREG)
{if(size==2)
return"state.a"+reg+"="+data+"&4294967295;"
if(size==1)
return"state.a"+reg+"=ewl("+data+")&4294967295;"}
if(mode==MODE_AREG_INDIRECT)
return get_write(size)+"(state.a"+reg+","+data+");"
if(mode==MODE_AREG_POSTINC)
return get_write(size)+"(state.a"+reg+","+data+"); state.a"+reg+"+="+increment+";"
if(mode==MODE_AREG_PREDEC){return"state.a"+reg+"-="+increment+"; "+get_write(size)+"(state.a"+reg+","+data+");"}
if(mode==MODE_AREG_OFFSET)
return read_pc(1,"o",true)+get_write(size)+"(state.a"+reg+"+ewl(o),"+data+");"
if(mode==MODE_AREG_INDEX)
{var code=read_pc(1,"e",true)
code+="var a=e%256;"
code+="if(a>127)a-=256;"
code+="a+=state.a"+reg+";"
code+="var x=(e>>>12)&7;"
code+="var y=(e>32767)?an(x):dn(x);"
code+="if(!(e&0x800))y=ewl(y);"
code+=get_write(size)+"(a+y,"+data+");"
return code;}
if(mode==MODE_DREG)
{if(size==2)
return"state.d"+reg+"="+data+"&4294967295;"
if(size==0)
return"state.d"+reg+"=((state.d"+reg+">>>8)*256)+("+data+"&255);"
if(size==1)
return"state.d"+reg+"=((state.d"+reg+">>>16)*65536)+("+data+"&65535);"}
return"fire_cpu_exception(4);"}
function effective_address_calculation_time(mode,reg,size)
{if(mode==MODE_DREG||mode==MODE_AREG){return 0;}
if(mode==MODE_AREG_INDIRECT){return(size!=2)?4:8;}
if(mode==MODE_AREG_POSTINC){return(size!=2)?4:8;}
if(mode==MODE_AREG_PREDEC){return(size!=2)?6:10;}
if(mode==MODE_AREG_OFFSET){return(size!=2)?8:12;}
if(mode==MODE_AREG_INDEX){return(size!=2)?10:14;}
if(mode==MODE_MISC){if(reg==MISCMODE_SHORT){return(size!=2)?8:12;}
if(reg==MISCMODE_LONG){return(size!=2)?12:16;}
if(reg==MISCMODE_PC_OFFSET){return(size!=2)?8:12;}
if(reg==MISCMODE_PC_INDEX){return(size!=2)?10:14;}
if(reg==MISCMODE_IMM){return(size!=2)?4:8;}}
return 0;}
function build_moveq()
{for(var data=0;data<=255;data++){for(var reg=0;reg<8;reg++){var opcode=0x7000+(reg<<9)+data;var code="state.sr &= 65520;";code+="state.d"+reg+" = ";if(data<128){code+=data+"; ";if(data==0)
code+="state.sr |= 4;";}
else
code+=(data+0xFFFFFF00)+"; state.sr |= 8; ";insert_inst2(opcode,code,"MOVEQ #"+state.hex_prefix+(data>=128?to_hex(data-256,2):to_hex(data,2))+",D"+reg,4);}}}
function build_addsubq()
{for(var offset=-8;offset<9;offset++){if(offset!=0){for(var mode=0;mode<8;mode++){for(var reg=0;reg<8;reg++){for(var size=0;size<3;size++){if(valid_dest(mode,reg)&&(mode!=MODE_AREG||size!=0))
{var name="";var opcode=0;if(offset>0)
{opcode=0x5000+(offset<<9)
if(offset==8)opcode=0x5000
opcode+=(size<<6)+(mode<<3)+reg
name="ADDQ"+size_name(size)+" #"+offset+","+amode_name(mode,reg,0)}
else
{opcode=0x5100+((-offset)<<9)
if(offset==-8)opcode=0x5100
opcode+=(size<<6)+(mode<<3)+reg
name="SUBQ"+size_name(size)+" #"+(-offset)+","+amode_name(mode,reg,0)}
var actualsize=(mode==MODE_AREG)?2:size;var cost=(size==2)?(((mode==MODE_DREG)||(mode==MODE_AREG))?4:8):(((mode==MODE_DREG)||(mode==MODE_AREG))?8:12);var code=amode_read(mode,reg,actualsize,false);if(mode==MODE_AREG)
{code+="var r=s+"+offset+";"
if(offset<0)code+="if(r<0)r+=4294967296;"
if(offset>0)code+="if(r>4294967295)r-=4294967296;"}
else
{if(size==0&&offset<0)
code+="var r=subb("+(-offset)+", s);"
if(size==0&&offset>0)
code+="var r=addb("+offset+", s);"
if(size==1&&offset<0)
code+="var r=subw("+(-offset)+", s);"
if(size==1&&offset>0)
code+="var r=addw("+offset+", s);"
if(size==2&&offset<0)
code+="var r=subl("+(-offset)+", s);"
if(size==2&&offset>0)
code+="var r=addl("+offset+", s);"
code+="state.sr = (state.sr&0xFFEF)|((state.sr&1)<<4);"}
code+=amode_write(mode,reg,actualsize,"r")
insert_inst2(opcode,code,name,cost+effective_address_calculation_time(mode,reg,size));}}}}}}}
function build_conditionals(condition,name,bits)
{var bcc_opcode=0x6000+(bits<<8)
var dbcc_opcode=0x50C8+(bits<<8)
var scc_opcode=0x50C0+(bits<<8)
for(var o=0;o<256;o++){var opcode=bcc_opcode+o;var iname="B"+name;var cost=10;if(iname=="BT"){iname="BRA";}
if(iname=="BF"){iname="BSR";cost=18;}
if(o==0){iname=iname+".W disp";}
else{iname=iname+".S disp";}
var code="";if(o==0)
{code="var o=rw(state.pc);"
if(name=="F")
{code+=amode_write(4,7,2,"(state.pc+2)")
code+="if(true) {"}
else
{code+=condition+"{";}
code+="state.pc+=ewl(o);";code+="if(state.pc>4294967295)state.pc-=4294967296;";code+="}";code+="else {";code+="state.pc += 2; state.cycle_count += 2;";code+="}";}
else
{if(name=="F")
code=amode_write(4,7,2,"state.pc")
else
code+=condition+"{";if(o<128)
code+="state.pc+="+o+";"
else
code+="state.pc-="+(256-o)+";"
if(name!="F"){code+="}";code+="else {";code+="state.cycle_count -= 2;";code+="}";}}
insert_inst2(opcode,code,iname,cost)}
for(var reg=0;reg<8;reg++){var opcode=dbcc_opcode+reg
var cost=10;var code=condition+"{ state.pc += 2; state.cycle_count += 2; } else {"
code+="var p=state.d"+reg+";"
code+="var u=(p>>>16)*65536;"
code+="var l=p%65536;"
code+="var m=(l - 1)&65535;"
code+="state.d"+reg+"=u+m;"
code+="if(m==65535) {"
code+="state.pc+=2; state.cycle_count += 4;"
code+="} else {"
code+="state.pc=(state.pc+ewl(rw(state.pc)))%4294967296;}"
code+="}"
insert_inst2(opcode,code,"DB"+name+" D"+reg+",disp",cost)}
for(var reg=0;reg<8;reg++){for(var mode=0;mode<8;mode++){if(valid_dest(mode,reg)&&mode!=1)
{var opcode=scc_opcode+reg+(mode<<3)
var cost=(mode==MODE_DREG)?4:8;var code=condition+"{"
code+=amode_write(mode,reg,0,"255");if(mode==MODE_DREG)code+="state.cycle_count += 2;"
code+="} else {"
code+=amode_write(mode,reg,0,"0")
code+="}"
insert_inst2(opcode,code,"S"+name+" "+amode_name(mode,reg,0),cost+effective_address_calculation_time(mode,reg,0))}}}}
function build_moves(name,size,pattern)
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){for(var dstmode=0;dstmode<8;dstmode++){if(size==0&&(dstmode==1||srcmode==1))continue;for(var dstreg=0;dstreg<8;dstreg++){if(valid_source(srcmode,srcreg)&&valid_dest(dstmode,dstreg))
{var opcode=pattern+(dstreg<<9)+(dstmode<<6)+(srcmode<<3)+srcreg
var fullname=((dstmode==1)?name.replace("MOVE","MOVEA"):name)+" "+amode_name(srcmode,srcreg,size)+","+amode_name(dstmode,dstreg,size)
var code=amode_read(srcmode,srcreg,size,true)
code+=amode_write(dstmode,dstreg,size,"s")
if(dstmode!=MODE_AREG){code+=set_condition_flags_data(size,"s")}
insert_inst2(opcode,code,fullname,4+effective_address_calculation_time(srcmode,srcreg,size)+effective_address_calculation_time(dstmode,dstreg,size))}}}}}}
function build_movep()
{for(var opmode=4;opmode<6;opmode++){for(var areg=0;areg<8;areg++){for(var dreg=0;dreg<8;dreg++){var opcode=0x0008+(dreg<<9)+(opmode<<6)+areg
var fullname="MOVEP"+((opmode&1)?".L ":".W ")+"d(A"+areg+"),D"+dreg;var code="state.pc += 2"
insert_inst2(opcode,code,fullname,((opmode&1)?24:16))}}}
for(var opmode=6;opmode<8;opmode++){for(var areg=0;areg<8;areg++){for(var dreg=0;dreg<8;dreg++){var opcode=0x0008+(dreg<<9)+(opmode<<6)+areg
var fullname="MOVEP"+((opmode&1)?".L ":".W ")+"D"+dreg+",d(A"+areg+")"
var code="state.pc += 2"
insert_inst2(opcode,code,fullname,((opmode&1)?24:16))}}}}
function build_operation(name,size,source,dest)
{var code="";if(size==0&&name=="ADD")code="var r=addb("+source+","+dest+");"
if(size==1&&name=="ADD")code="var r=addw("+source+","+dest+");"
if(size==2&&name=="ADD")code="var r=addl("+source+","+dest+");"
if(size==0&&name=="SUB")code="var r=subb("+source+","+dest+");"
if(size==1&&name=="SUB")code="var r=subw("+source+","+dest+");"
if(size==2&&name=="SUB")code="var r=subl("+source+","+dest+");"
if(name=="OR")code+="var r="+source+"|"+dest+";"
if(name=="AND")code+="var r="+source+"&"+dest+";"
if(name=="EOR")code+="var r="+source+"^"+dest+";"
if(name=="OR"||name=="AND"||name=="EOR")
{code+="if(r<0)r+=4294967296;"
if(size==0)code+="r&=255;"
if(size==1)code+="r&=65535;"
code+=set_condition_flags_data(size,"r")}
return code;}
function build_calc(name,bits)
{for(var dreg=0;dreg<8;dreg++){for(var reg=0;reg<8;reg++){for(var mode=0;mode<8;mode++){for(var size=0;size<3;size++){var opcode=bits+(dreg<<9)+(size<<6)+(mode<<3)+reg
if(valid_source(mode,reg)&&name!="EOR")
{var iname=name+size_name(size)+" "+amode_name(mode,reg,size)+",D"+dreg
var code=amode_read(mode,reg,size,true)
var cost=4;if(size==2){cost+=2;if(mode==MODE_DREG||(mode==MODE_MISC&&reg==MISCMODE_IMM)){cost+=2;}}
code+=build_operation(name,size,"s","state.d"+dreg+"")
code+=amode_write(MODE_DREG,dreg,size,"r")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(mode,reg,size))}
if(valid_dest(mode,reg)&&(mode!=MODE_DREG||name=="EOR")&&mode!=MODE_AREG)
{opcode=opcode+0x100
var iname=name+size_name(size)+" D"+dreg+","+amode_name(mode,reg,size)
var code=amode_read(mode,reg,size,false)
var cost=(size==2)?12:8;code+=build_operation(name,size,"state.d"+dreg,"s")
code+=amode_write(mode,reg,size,"r")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(mode,reg,size))}}}}}}
function build_muldiv(name,bits,calcfunc,cost)
{for(var dreg=0;dreg<8;dreg++){for(var mode=0;mode<8;mode++){for(var reg=0;reg<8;reg++){if(valid_source(mode,reg)&&mode!=MODE_AREG){var opcode=bits+(dreg<<9)+(mode<<3)+reg
var iname=name+" "+amode_name(mode,reg,1)+",D"+dreg
var code=amode_read(mode,reg,1,true)
code+="state.d"+dreg+" = "+calcfunc+"(s,state.d"+dreg+");";insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(mode,reg,1))}}}}}
function build_bit_operation(name,bits,registercost,memorycost)
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(srcmode!=1&&(valid_dest(srcmode,srcreg)||(name=='BTST'&&srcmode==MODE_MISC&&(srcreg==MISCMODE_PC_OFFSET||srcreg==MISCMODE_PC_INDEX)))){for(var dreg=0;dreg<=8;dreg++)
{var opcode,iname,code="";if(dreg==8)
{opcode=bits+(srcmode<<3)+srcreg;iname=name+" #xxx,"+amode_name(srcmode,srcreg,0)}
else
{opcode=bits+(srcmode<<3)+srcreg-0x700+(dreg<<9);iname=name+" D"+dreg+","+amode_name(srcmode,srcreg,0)}
if(dreg==8)
code=read_pc(1,"b",true)
if(srcmode<=1)
{if(dreg==8)
code+="b&=31;"
else
code+="var b=31&state.d"+dreg+";"
code+=amode_read(srcmode,srcreg,2,name=="BTST")}
else
{if(dreg==8)
code+="b&=7;"
else
code+="var b=7&state.d"+dreg+";"
code+=amode_read(srcmode,srcreg,0,name=="BTST")}
code+="state.sr|=4;"
code+="if (s&(1<<b))state.sr=state.sr&65531;"
if(name!="BTST")
{if(srcmode<=1)
{if(name=="BCLR")code+="s&=(4294967295-(1<<b));"
if(name=="BSET")code+="s|=(1<<b);"
if(name=="BCHG")code+="s^=(1<<b);"
code+="if(s<0)s+=4294967296;"
code+=amode_write(srcmode,srcreg,2,"s")}
else
{if(name=="BCLR")code+="s&=(255-(1<<b));"
if(name=="BSET")code+="s|=(1<<b);"
if(name=="BCHG")code+="s^=(1<<b);"
code+=amode_write(srcmode,srcreg,0,"s")}}
insert_inst(opcode,code,iname)}}}}}
function build_cmp()
{for(var size=0;size<3;size++){for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){for(var firstreg=0;firstreg<8;firstreg++){if(valid_source(srcmode,srcreg))
{var opcode=0xB000+(firstreg<<9)+(size<<6)+(srcmode<<3)+srcreg;var iname="CMP"+size_name(size)+" "+amode_name(srcmode,srcreg,size)+",D"+firstreg
var code=amode_read(srcmode,srcreg,size,true)
var cost=(size==2)?6:4;code+="var m=state.d"+firstreg+";"
if(size==1)code+="m=m&0xFFFF;"
if(size==0)code+="m=m&0xFF;"
if(size==0)code+="cmpb(s,m);"
if(size==1)code+="cmpw(s,m);"
if(size==2)code+="cmpl(s,m);"
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))}}}}}}
function build_adest()
{for(var areg=0;areg<8;areg++){for(var srcreg=0;srcreg<8;srcreg++){for(var srcmode=0;srcmode<8;srcmode++){for(var size=1;size<3;size++){if(valid_source(srcmode,srcreg))
{var opcode=0xB0C0+(areg<<9)+((size-1)<<8)+(srcmode<<3)+srcreg
var iname="CMPA"+size_name(size)+" "+amode_name(srcmode,srcreg,size)+",A"+areg
var code=amode_read(srcmode,srcreg,size,true)
var cost=6+effective_address_calculation_time(srcmode,srcreg,size);if(size==1)code+="s=ewl(s);"
code+="cmpl(s,state.a"+areg+");"
insert_inst2(opcode,code,iname,cost)
cost+=2;if(size==2&&srcmode!=MODE_DREG&&(srcmode!=MODE_MISC||srcreg!=MISCMODE_IMM)){cost-=2;}
opcode=0x90C0+(areg<<9)+((size-1)<<8)+(srcmode<<3)+srcreg
iname="SUBA"+size_name(size)+" "+amode_name(srcmode,srcreg,size)+",A"+areg
code=amode_read(srcmode,srcreg,size,true)
if(size==1)code+="s=ewl(s);"
code+="var r=state.a"+areg+" - s;"
code+="if(r<0)r+=4294967296;"
code+=amode_write(1,areg,2,"r")
insert_inst2(opcode,code,iname,cost)
opcode=0xD0C0+(areg<<9)+((size-1)<<8)+(srcmode<<3)+srcreg
iname="ADDA"+size_name(size)+" "+amode_name(srcmode,srcreg,size)+",A"+areg
code=amode_read(srcmode,srcreg,size,true)
if(size==1)code+="s=ewl(s);";cost+=2;code+="var r=state.a"+areg+" + s;"
code+="if(r>4294967295)r-=4294967296;"
code+=amode_write(1,areg,2,"r")
insert_inst2(opcode,code,iname,cost)}}}}}}
function build_shifts(name,mask,altmask,namelower)
{for(var reg=0;reg<8;reg++){for(var size=0;size<3;size++){for(var shift=0;shift<8;shift++){for(var mm=0;mm<2;mm++){var actualshift=shift==0?8:shift;var iname="";var opcode=mask+0x20+(size<<6)+reg+(shift<<9);var shiftamount;var cost=(size==2)?8:6;if(mm==0)
{opcode=opcode-0x20;iname=name+size_name(size)+" #"+actualshift+",D"+reg
shiftamount=actualshift}
else
{iname=name+size_name(size)+" D"+shift+",D"+reg
shiftamount="state.d"+shift+"&31";}
var src="";if(size==0)src="state.d"+reg+"&255"
else if(size==1)src="state.d"+reg+"&65535"
else if(size==2)src="state.d"+reg
var code=amode_write(MODE_DREG,reg,size,namelower+"("+src+","+shiftamount+","+size+")")
insert_inst2(opcode,code,iname,cost)}}}}
for(var reg=0;reg<8;reg++){for(var mode=0;mode<8;mode++){if(valid_dest(mode,reg)&&mode!=MODE_DREG&&mode!=MODE_AREG)
{var opcode=altmask+(mode<<3)+reg;var iname=name+".W "+amode_name(mode,reg,1)
var code=amode_read(mode,reg,1,false)
code+=amode_write(mode,reg,1,namelower+"(s,1,1)")
insert_inst2(opcode,code,iname,8+effective_address_calculation_time(mode,reg,1))}}}}
function build_immediate(name,mask,operation)
{for(var reg=0;reg<8;reg++){for(var mode=0;mode<8;mode++){for(var size=0;size<3;size++){if((valid_dest(mode,reg)&&mode!=MODE_AREG)||(mode==MODE_MISC&&reg==4&&size<2&&operation!=""))
{var opcode=mask+(size<<6)+(mode<<3)+reg
var mode_name=amode_name(mode,reg,size)
if(mode==MODE_MISC&&reg==4&&size==0)mode_name="CCR"
if(mode==MODE_MISC&&reg==4&&size==1)mode_name="SR"
var iname=name+size_name(size)+size_imm(size)+mode_name
var code=read_pc(size,"m",true)
var cost=(mode==MODE_DREG)?8:12;if(size==2){cost+=6;if(name!="ANDI"||mode!=MODE_DREG){cost+=2;}}
if(mode==MODE_MISC&&reg==4)
{if(size==1)code+="if(state.sr&0x2000==0)fire_cpu_exception(8);";if(size==0&&name=="ANDI")code+="m|=0xFF00;"
code+="update_sr(state.sr"+operation.substring(7,8)+"m);"
insert_inst2(opcode,code,iname,20)}
else
{code+=amode_read(mode,reg,size,false)
if(operation!="")
{code+=operation;code+=set_condition_flags_data(size,"r")}
else
{code+="var r="+name.substring(0,3).toLowerCase()+size_name(size).substring(1,2).toLowerCase()+"(m,s);"}
code+=amode_write(mode,reg,size,"r")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(mode,reg,size))}}}}}}
function build_ext(name,bits)
{for(var src=0;src<8;src++){for(var dst=0;dst<8;dst++){for(var size=0;size<3;size++){for(var mem=0;mem<2;mem++){var opcode=bits+(dst<<9)+(size<<6)+(mem<<3)+src
var iname=name+size_name(size)
if(mem==0)
iname+=" D"+src+",D"+dst+"'"
else
iname+=" -(A"+src+"),-(A"+dst+")'"
var mode=mem==0?MODE_DREG:MODE_AREG_PREDEC
var code=amode_read(mode,src,size,true)
code+="var c=s;"
code+=amode_read(mode,dst,size,false)
code+="var n="+name.toLowerCase()+"(c,s,"+size+");"
code+=amode_write(mode,dst,size,"n")
var cost=(mode==MODE_DREG)?((size==2)?8:4):((size==2)?30:18)
insert_inst2(opcode,code,iname,cost)}}}}}
function build_not_neg_clr_tst_tas()
{for(var size=0;size<3;size++){for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(valid_dest(srcmode,srcreg)&&srcmode!=MODE_AREG)
{var opcode=0x4600+(size<<6)+(srcmode<<3)+srcreg;var iname="NOT"+size_name(size)+" "+amode_name(srcmode,srcreg,size)
var code=amode_read(srcmode,srcreg,size,false)
var cost=(size==2)?6:4;if(srcmode!=MODE_DREG){cost*=2;}
if(size==0)code+="s=255-s;"
if(size==1)code+="s=65535-s;"
if(size==2)code+="s=4294967295-s;"
code+=set_condition_flags_data(size,"s")
code+=amode_write(srcmode,srcreg,size,"s")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))
opcode=0x4400+(size<<6)+(srcmode<<3)+srcreg;iname="NEG"+size_name(size)+" "+amode_name(srcmode,srcreg,size)
code=amode_read(srcmode,srcreg,size,false)
code+="state.sr &= 0xFFE0;"
if(size==0)code+="var r=s==0?0:256-s;if(r&0x80)state.sr|=8;"
if(size==1)code+="var r=s==0?0:65536-s;if(r&0x8000)state.sr|=8;"
if(size==2)code+="var r=s==0?0:4294967296-s;if(r&2147483647)state.sr|=8;"
code+="if(r==0)state.sr|=4;else state.sr|=17;"
code+=amode_write(srcmode,srcreg,size,"r")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))
opcode=0x4000+(size<<6)+(srcmode<<3)+srcreg;iname="NEGX"+size_name(size)+" "+amode_name(srcmode,srcreg,size)
code=amode_read(srcmode,srcreg,size,false)
code+="state.sr &= 0xFFF0;"
code+="if(state.sr&0x10)s++;"
if(size==0)code+="var r=256-s;"
if(size==1)code+="var r=65536-s;"
if(size==2)code+="var r=4294967296-s;if(r>4294967295)r=0;"
code+=set_condition_flags_data(size,"r")
code+=amode_write(srcmode,srcreg,size,"r")
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))
opcode=0x4200+(size<<6)+(srcmode<<3)+srcreg;iname="CLR"+size_name(size)+" "+amode_name(srcmode,srcreg,size)
code=amode_write(srcmode,srcreg,size,"0")
code+="state.sr|=4;"
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))
opcode=0x4a00+(size<<6)+(srcmode<<3)+srcreg;iname="TST"+size_name(size)+" "+amode_name(srcmode,srcreg,size)
code=amode_read(srcmode,srcreg,size,true)
code+=set_condition_flags_data(size,"s")
insert_inst2(opcode,code,iname,4+effective_address_calculation_time(srcmode,srcreg,size))
if(size==0)
{opcode=0x4ac0+(srcmode<<3)+srcreg;iname="TAS.B"+" "+amode_name(srcmode,srcreg,0)
code=amode_read(srcmode,srcreg,0,true)
code+=set_condition_flags_data(0,"s")
code+=amode_write(srcmode,srcreg,0,"s | 0x80")
insert_inst2(opcode,code,iname,(srcmode==MODE_DREG)?4:(14+effective_address_calculation_time(srcmode,srcreg,size)))}}}}}}
function build_lea()
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){for(var reg=0;reg<8;reg++){if(valid_calc_effective_address(srcmode,srcreg))
{var opcode=0x41C0+(reg<<9)+(srcmode<<3)+srcreg;var iname="LEA "+amode_name(srcmode,srcreg,1)+",A"+reg
var code=effective_address_calc(srcmode,srcreg)
code+="state.a"+reg+"=z;"
if(opcode==0x41FA&&enable_kludge_in_lea_d_pc_a0){code+="if((o == 7) && (state.pc < 0x40000) && (rw(state.pc) == 0x4210) && (rw(state.pc+2) == 0x6000) && (rw(state.pc+4) == 0x000A) && (rw(state.pc+6) == 0x0000) && (rw(state.pc+8) == 0x4E4C) && (rw(state.pc+10) == 0x534F) && (rw(state.pc+12) == 0x4AFC)) { state.pc += 14; }";}
insert_inst(opcode,code,iname)}}}}}
function build_cmpi()
{for(var size=0;size<3;size++){for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(valid_dest(srcmode,srcreg))
{var opcode=0xC00+(size<<6)+(srcmode<<3)+srcreg;var iname="CMPI"+size_name(size)+size_imm(size)+amode_name(srcmode,srcreg,size)
var code=read_pc(size,"subtrahend",true)
var cost=8;if(size==2){cost+=4;if(srcmode==MODE_DREG){cost+=2;}}
code+=amode_read(srcmode,srcreg,size,true)
if(size==0)code+="cmpb(subtrahend, s);"
if(size==1)code+="cmpw(subtrahend, s);"
if(size==2)code+="cmpl(subtrahend, s);"
insert_inst2(opcode,code,iname,cost+effective_address_calculation_time(srcmode,srcreg,size))}}}}}
function build_movem()
{for(var reg=0;reg<8;reg++){for(var mode=0;mode<8;mode++){for(var size=1;size<3;size++){var actualsize=size*2
if(mode==MODE_AREG_INDIRECT||mode==MODE_AREG_POSTINC||mode==MODE_AREG_OFFSET||mode==MODE_AREG_INDEX||(mode==MODE_MISC&&(reg==MISCMODE_SHORT||reg==MISCMODE_LONG||reg==MISCMODE_PC_OFFSET||reg==MISCMODE_PC_INDEX)))
{var opcode=0x4c80+((size-1)<<6)+(mode<<3)+reg
var iname="MOVEM"+size_name(size+1)+" "+amode_name(mode,reg,size)+",regs"
var code=read_pc(1,"regs",true)
if(mode==MODE_AREG_POSTINC)
code+="var newval = load_multiple_postinc(state.a"+reg+", regs, "+size+"); state.a"+reg+" = newval;";else
{code+=effective_address_calc(mode,reg);code+="load_multiple(z,regs,"+size+");"}
insert_inst(opcode,code,iname)}
if(mode==MODE_AREG_INDIRECT||mode==MODE_AREG_PREDEC||mode==MODE_AREG_OFFSET||mode==MODE_AREG_INDEX||(mode==MODE_MISC&&(reg==MISCMODE_SHORT||reg==MISCMODE_LONG)))
{var opcode=0x4880+((size-1)<<6)+(mode<<3)+reg
var iname="MOVEM"+size_name(size)+" regs,"+amode_name(mode,reg,size)
var code=read_pc(1,"regs",true)
if(mode==MODE_AREG_PREDEC)
{iname=iname.replace("regs","regspredec");code+="var newval = store_multiple_predec(state.a"+reg+", regs, "+size+"); state.a"+reg+" = newval;";}
else
{code+=effective_address_calc(mode,reg)
code+="store_multiple(z, regs, "+size+");"}
insert_inst(opcode,code,iname)}}}}}
function build_cmpm()
{for(var src=0;src<8;src++){for(var dest=0;dest<8;dest++){for(var size=0;size<3;size++){var opcode=0xB108+(dest<<9)+(size<<6)+src
var iname="CMPM"+size_name(size)+" (A"+src+")+,(A"+dest+")+'"
var code=amode_read(MODE_AREG_POSTINC,src,size,true)
code+="var u=s;"
code+=amode_read(MODE_AREG_POSTINC,dest,size,true)
if(size==0)code+="cmpb(u,s);"
if(size==1)code+="cmpw(u,s);"
if(size==2)code+="cmpl(u,s);"
insert_inst2(opcode,code,iname,(size==2)?20:12)}}}}
function build_bcd()
{for(var src=0;src<8;src++){for(var dest=0;dest<8;dest++){for(var m=1;m>=0;m--){for(var sub=0;sub<=1;sub++){var operation=sub==0?"ABCD":"SBCD"
var opcode=0x8100+(dest<<9)+src
if(operation=="ABCD")opcode+=0x4000
var iname=""
var cost=0;if(m!=0)
{opcode+=8
iname=operation+" -(A"+src+"),-(A"+dest+")"
cost=18;}
else
{iname=operation+" D"+src+",D"+dest
cost=6;}
var code=""
if(m!=0)
{code=amode_read(MODE_AREG_PREDEC,src,0,true)
code+="var other = s;"
code+=amode_read(MODE_AREG_PREDEC,dest,0,true)
code+=amode_write(MODE_AREG_INDIRECT,dest,0,operation.toLowerCase()+"(s,other)")}
else
{code="state.d"+dest+"+="+operation.toLowerCase()+"(state.d"+dest+",state.d"+src+")-state.d"+dest+"&0xFF;"}
insert_inst2(opcode,code,iname,cost)}}}}
for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(valid_dest(srcmode,srcreg)&&srcmode!=MODE_AREG)
{opcode=0x4800+(srcmode<<3)+srcreg;iname="NBCD "+amode_name(srcmode,srcreg,0)
code=amode_read(srcmode,srcreg,0,false)
code+="var r=nbcd(s);"
code+=amode_write(srcmode,srcreg,0,"r")
insert_inst2(opcode,code,iname,(srcmode==MODE_DREG)?6:(8+effective_address_calculation_time(srcmode,srcreg,0)))}}}}
function build_movesrccr()
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(valid_source(srcmode,srcreg)&&srcmode!=MODE_AREG)
{var opcode=0x46C0+(srcmode<<3)+srcreg;var iname="MOVE "+amode_name(srcmode,srcreg,1)+",SR"
var cost=12+effective_address_calculation_time(srcmode,srcreg,0);insert_inst2(opcode,"if(state.sr&0x2000==0)fire_cpu_exception(8);"+amode_read(srcmode,srcreg,1,true)+"update_sr(s);",iname,cost)
opcode=0x44C0+(srcmode<<3)+srcreg;iname="MOVE "+amode_name(srcmode,srcreg,0)+",CCR"
insert_inst2(opcode,amode_read(srcmode,srcreg,0,true)+"state.sr = (state.sr&0xFF00) + s;",iname,cost)}
if(valid_dest(srcmode,srcreg)&&srcmode!=MODE_AREG)
{var opcode=0x40C0+(srcmode<<3)+srcreg;var iname="MOVE SR,"+amode_name(srcmode,srcreg,1)
var cost=(srcmode==MODE_DREG)?6:8;insert_inst2(opcode,amode_write(srcmode,srcreg,1,"state.sr"),iname,cost+effective_address_calculation_time(srcmode,srcreg,1))}}}}
function build_exchange(xtype,ytype,bits)
{for(var x=0;x<8;x++){for(var y=0;y<8;y++){var opcode=bits+(x<<9)+y
var iname="EXG "+xtype+x+","+ytype+y
var xstr="state."+xtype.toLowerCase()+x
var ystr="state."+ytype.toLowerCase()+y
var code="var e="+xstr+";"
code+=xstr+"="+ystr+";"
code+=ystr+"=e;"
insert_inst2(opcode,code,iname,6)}}}
function build_jmpjsr()
{for(var mode=0;mode<8;mode++){for(var reg=0;reg<8;reg++){if(valid_calc_effective_address(mode,reg)){for(var jsr=1;jsr>=0;jsr--){var opcode=0x4EC0+(mode<<3)+reg-jsr*0x40;var iname=(jsr==1?"JSR ":"JMP ")+amode_name(mode,reg,0)
var code=effective_address_calc(mode,reg)
if(jsr==1)
code+=amode_write(4,7,2,"state.pc")
code+="state.pc=z;"
insert_inst(opcode,code,iname)}}}}}
function build_pea()
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){if(valid_calc_effective_address(srcmode,srcreg))
{var opcode=0x4840+(srcmode<<3)+srcreg;var iname="PEA "+amode_name(srcmode,srcreg,0)
insert_inst(opcode,effective_address_calc(srcmode,srcreg)+amode_write(4,7,2,"z"),iname)}}}}
function build_swap()
{for(var reg=0;reg<8;reg++){var code="var l = state.d"+reg+"&65535;"
code+="var h = state.d"+reg+" >>> 16;"
code+="state.d"+reg+" = (l * 65536) + h;"
insert_inst2(0x4840+reg,code,"SWAP D"+reg,4)}}
function build_chk()
{for(var srcmode=0;srcmode<8;srcmode++){for(var srcreg=0;srcreg<8;srcreg++){for(var reg=0;reg<8;reg++){if(valid_dest(srcmode,srcreg)&&srcmode!=MODE_AREG)
{var opcode=0x4180+(reg<<9)+(srcmode<<3)+srcreg;var iname="CHK.W "+amode_name(srcmode,srcreg,1)+",D"+reg
var code=amode_read(srcmode,srcreg,1,true)
code+="if (state.d"+reg+"<0) { state.sr |= 8; fire_cpu_exception(6); } if(state.d"+reg+"> s) { state.sr &= 0xFFF7; fire_cpu_exception(6); }"
insert_inst(opcode,code,iname)}}}}}
function build_initial_instructions_handlers()
{var i;for(i=0;i<0xA000;i++){cpu.t[i]=unhandled_instruction;cpu.n[i]='UNKNOWN';cpu.cycles[i]=0;}
for(i=0xA000;i<=0xAFFF;i++){cpu.t[i]=aline;cpu.n[i]="ALINE "+to_hex(i,3);cpu.cycles[i]=34;}
for(i=0xB000;i<0xF000;i++){cpu.t[i]=unhandled_instruction;cpu.n[i]='UNKNOWN';cpu.cycles[i]=0;}
for(i=0xF000;i<=0xFFFF;i++){cpu.t[i]=fline;cpu.n[i]="FLINE "+to_hex(i,3);cpu.cycles[i]=34;}}
function build_all_instructions()
{build_initial_instructions_handlers();build_moveq();build_addsubq();build_moves("MOVE.L",2,0x2000);build_moves("MOVE.W",1,0x3000);build_moves("MOVE.B",0,0x1000);build_movep();build_conditionals("if(true)","T",0)
build_conditionals("if(false)","F",1)
build_conditionals("if(!(state.sr&5))","HI",2)
build_conditionals("if(state.sr&5)","LS",3)
build_conditionals("if(!(state.sr&1))","CC",4)
build_conditionals("if(state.sr&1)","CS",5)
build_conditionals("if(!(state.sr&4))","NE",6)
build_conditionals("if(state.sr&4)","EQ",7)
build_conditionals("if(!(state.sr&2))","VC",8)
build_conditionals("if(state.sr&2)","VS",9)
build_conditionals("if(!(state.sr&8))","PL",10)
build_conditionals("if(state.sr&8)","MI",11)
build_conditionals("if(((state.sr&10)==0)||((state.sr&10)==10))","GE",12)
build_conditionals("if(((state.sr&10)==8)||((state.sr&10)==2))","LT",13)
build_conditionals("if((((state.sr&10)==0)||((state.sr&10)==10))&(!(state.sr&4)))","GT",14)
build_conditionals("if((state.sr&4)||((state.sr&10)==8)||((state.sr&10)==2))","LE",15)
build_calc("EOR",0xB000)
build_calc("ADD",0xD000)
build_calc("AND",0xC000)
build_calc("SUB",0x9000)
build_calc("OR",0x8000)
build_muldiv("DIVS",0x81C0,"divs",158)
build_muldiv("DIVU",0x80C0,"divu",140)
build_muldiv("MULS",0xC1C0,"muls",70)
build_muldiv("MULU",0xC0C0,"mulu",70)
build_bit_operation("BCHG",0x840,8,8)
build_bit_operation("BCLR",0x880,10,8)
build_bit_operation("BSET",0x8C0,8,8)
build_bit_operation("BTST",0x800,6,4)
build_shifts("ASL",0xE100,0xE1C0,"asl")
build_shifts("ASR",0xE000,0xE0C0,"asr")
build_shifts("LSL",0xE108,0xE3C0,"lsl")
build_shifts("LSR",0xE008,0xE2C0,"lsr")
build_shifts("ROXL",0xE110,0xE5C0,"roxl")
build_shifts("ROXR",0xE010,0xE4C0,"roxr")
build_shifts("ROL",0xE118,0xE7C0,"rol")
build_shifts("ROR",0xE018,0xE6C0,"ror")
build_cmp()
build_adest()
build_immediate("ORI",0,"var r=s|m;")
build_immediate("ANDI",0x200,"var r=s&m;")
build_immediate("EORI",0xA00,"var r=s^m;")
build_immediate("ADDI",0x600,"")
build_immediate("SUBI",0x400,"")
build_ext("ADDX",0xD100)
build_ext("SUBX",0x9100)
build_not_neg_clr_tst_tas()
build_lea()
build_cmpi()
build_movem()
build_cmpm()
build_bcd()
build_exchange("D","D",0xC140)
build_exchange("A","A",0xC148)
build_exchange("D","A",0xC188)
insert_inst2(0x4E70,"if(state.sr&0x2000==0)fire_cpu_exception(8);initialize_calculator()","RESET",132)
insert_inst2(0x4E71,"","NOP",4)
insert_inst2(0x4E72,"if(state.sr&0x2000==0)fire_cpu_exception(8);state.pc+=2","STOP #xxx",4)
insert_inst2(0x4E73,"if(state.sr&0x2000==0)fire_cpu_exception(8);var s=rw(state.a7);state.a7+=2;state.pc=rl(state.a7);state.a7+=4;update_sr(s)","RTE",20)
insert_inst2(0x4E75,"state.pc=rl(state.a7);state.a7+=4;","RTS",16)
insert_inst2(0x4E76,"if(state.sr&2)fire_cpu_exception(7)","TRAPV",4)
insert_inst2(0x4E77,"var s=rw(state.a7);state.a7+=2;state.pc=rl(state.a7);state.a7+=4;state.sr=(state.sr&0xFFE0)|(s&0x001F)","RTR",20)
insert_inst2(0x4AFC,"print_status(); disassemble(state.pc-32, 20); fire_cpu_exception(4)","ILLEGAL",34)
build_movesrccr()
build_jmpjsr()
build_pea()
build_swap()
build_chk()
for(var vector=0;vector<16;vector++){insert_inst2(0x4E40+vector,"fire_cpu_exception("+(32+vector)+")","TRAP #"+vector,34)}
for(var reg=0;reg<8;reg++){insert_inst2(0x4E60+reg,"if(state.sr&0x2000==0)fire_cpu_exception(8);state.a8=state.a"+reg,"MOVE A"+reg+",USP",4)
insert_inst2(0x4E68+reg,"if(state.sr&0x2000==0)fire_cpu_exception(8);state.a"+reg+"=state.a8","MOVE USP,A"+reg,4)
insert_inst2(0x4880+reg,"state.d"+reg+"=((state.d"+reg+">>>16)*65536)+ebw(state.d"+reg+")","EXT.W D"+reg,4)
insert_inst2(0x48C0+reg,"state.d"+reg+"=ewl(state.d"+reg+")","EXT.L D"+reg,4)
var linkcode="state.a7-=4; wl(state.a7,state.a"+reg+"); var o=rw(state.pc); state.pc+=2; state.a"+reg+"=state.a7; state.a7+=(o<0x8000?o:o-0x10000);"
insert_inst2(0x4e50+reg,linkcode,"LINK A"+reg+",#xxx",16)
var unlkcode="state.a7 = state.a"+reg+"; var s=rl(state.a7); state.a7+=4; state.a"+reg+" = s;"
insert_inst2(0x4e58+reg,unlkcode,"UNLK A"+reg,12)}
eval(instruction_list);var unknown=0;var nocost=0;for(var i=0;i<65536;i++){if(cpu.n[i]=="UNKNOWN"){unknown++;cpu.n[i]="DC.W "+state.hex_prefix+to_hex(i,4);}
if(cpu.cycles[i]==0){nocost++;}}
stdlib.console.log("number of unknown opcodes is "+unknown)
stdlib.console.log("number of opcodes without cycle cost is "+nocost)}
build_all_instructions();function read_hreg(reg)
{switch(reg)
{case 0x600000:{return 0x04;}
case 0x600001:{return state.vectorprotect?4:0;}
case 0x60000c:{return link.get_link_config();}
case 0x60000d:{return link.compute_link_status();}
case 0x60000e:{return 0x10;}
case 0x60000f:{return link.read_byte();}
case 0x600015:{return state.interrupt_control;}
case 0x600017:{return state.timer_current;}
case 0x600018:{return state.keymaskhigh;}
case 0x600019:{return state.keymasklow;}
case 0x60001a:{return state.port_60001A;}
case 0x60001b:{var result=0xFF;var keymask=state.keymaskhigh*256+state.keymasklow;for(var row=0;row<=9;row++){if((keymask&(1<<row))==0){for(var col=0;col<8;col++){if(state.keystatus[row*8+col]==1){result&=(0xFF-(1<<col));}}}}
state.port_60001B=result;return result;}
case 0x60001d:{return state.port_60001D;}
case 0x700017:{return state.port_700017;}
case 0x70001d:{return state.port_70001D;}
case 0x70001f:{return state.port_70001F;}
default:{return(reg&1)?0:0x14;}}}
function write_hreg(reg,value)
{switch(reg)
{case 0x600000:{break;}
case 0x600001:{state.vectorprotect=((value&4)==4);break;}
case 0x600002:case 0x600003:{break;}
case 0x600005:{state.wakemask=value;state.stopped=true;break;}
case 0x60000c:{link.set_link_config(value);break;}
case 0x60000f:{link.write_byte(value);break;}
case 0x600010:{state.lcd_address_high=value;break;}
case 0x600011:{state.lcd_address_low=value;break;}
case 0x600012:{state.screen_width=(64-(value&63))*16;break;}
case 0x600013:{state.screen_height=256-value;break;}
case 0x600014:{break;}
case 0x600015:{state.interrupt_control=value;switch((state.interrupt_control>>4)&0x3)
{case 0:state.interrupt_rate=0x20;break;case 1:state.interrupt_rate=0x200;break;case 2:state.interrupt_rate=0x1000;break;case 3:state.interrupt_rate=0x40000;break;}
break;}
case 0x600016:{break;}
case 0x600017:{state.timer_current=value;state.timer_min=value;break;}
case 0x600018:{state.keymaskhigh=value;break;}
case 0x600019:{state.keymasklow=value;break;}
case 0x60001a:{state.port_60001A=value;break;}
case 0x60001b:{state.port_60001B=value;break;}
case 0x60001c:{state.port_60001C=value;ui.set_screen_enabled_and_contrast(state.calculator_model,state.hardware_model,state.port_60001C,state.port_60001D,state.port_70001D,state.port_70001F);break;}
case 0x60001d:{state.port_60001D=value;ui.set_screen_enabled_and_contrast(state.calculator_model,state.hardware_model,state.port_60001C,state.port_60001D,state.port_70001D,state.port_70001F);break;}
case 0x700000:case 0x700001:case 0x700002:case 0x700003:case 0x700004:case 0x700005:case 0x700006:case 0x700007:case 0x700008:case 0x700009:case 0x70000a:case 0x70000b:case 0x70000c:case 0x70000d:case 0x70000e:case 0x70000f:{break;}
case 0x700010:case 0x700011:{break;}
case 0x700012:case 0x700013:{break;}
case 0x700017:{state.port_700017=value&0x03;state.lcd_address=0x4c00+(state.port_700017*0x1000);break;}
case 0x70001c:{break;}
case 0x70001d:{state.port_70001D=value;ui.set_screen_enabled_and_contrast(state.calculator_model,state.hardware_model,state.port_60001C,state.port_60001D,state.port_70001D,state.port_70001F);break;}
case 0x70001f:{state.port_70001F=value;ui.set_screen_enabled_and_contrast(state.calculator_model,state.hardware_model,state.port_60001C,state.port_60001D,state.port_70001D,state.port_70001F);break;}
default:{break;}}}
function build_memory_read_functions(suffix,flashmemoryaddress,flashmemorysize)
{var memory_read_function="rw_"+suffix+"_normal = function rw_"+suffix+"_normal(address)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 1; fire_cpu_exception(3); }"+"	address = address & 0xFFFFFE;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		return state.ram[(address & 0x3FFFE) >>> 1];"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		return state.rom[(address - "+flashmemoryaddress+") >>> 1];"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		return read_hreg(address) * 256 + read_hreg(address + 1);"+"	}"+"	else"+"		return 0x1400;"+"}";eval(memory_read_function);memory_read_function="rb_"+suffix+"_normal = function rb_"+suffix+"_normal(address)"+"{"+"	address = address & 0xFFFFFF;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		address &= 0x3FFFF;"+"		if ((address & 1) == 0) {"+"			return state.ram[address >>> 1] >>> 8;"+"		}"+"		else {"+"			return state.ram[address >>> 1] & 0xFF;"+"		}"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		if ((address & 1) == 0) {"+"			return state.rom[(address - "+flashmemoryaddress+") >>> 1] >>> 8;"+"		}"+"		else {"+"			return state.rom[(address - "+flashmemoryaddress+"- 1) >>> 1] & 0xFF;"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		return read_hreg(address);"+"	}"+"	else"+"		return (address & 1) ? 0 : 0x14;"+"}";eval(memory_read_function);memory_read_function="rw_"+suffix+"_flashspecial = function rw_"+suffix+"_flashspecial(address)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 1; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		return state.ram[(address & 0x3FFFE) >>> 1];"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		if (state.flash_write_phase == 0x90) {"+"			switch (address & 0xffff) {"+"				case 0:  return "+((suffix==8||suffix==9)?"0x00b0":"0x0089")+";"+"				case 2:  return "+((suffix==9&&state.large_flash_memory)?"0x00b0":"0x00b5")+";"+"				default: return 0xffff;"+"			}"+"		}"+"		else {"+"			return state.rom[(address - "+flashmemoryaddress+") >>> 1] | state.flash_ret_or;"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		return read_hreg(address) * 256 + read_hreg(address + 1);"+"	}"+"}";eval(memory_read_function);memory_read_function="rb_"+suffix+"_flashspecial = function rb_"+suffix+"_flashspecial(address)"+"{"+"	address = address & 0xFFFFFF;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		address &= 0x3FFFF;"+"		if ((address & 1) == 0) {"+"			return state.ram[address >>> 1] >>> 8;"+"		}"+"		else {"+"			return state.ram[address >>> 1] & 0xFF;"+"		}"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		if (state.flash_write_phase == 0x90) {"+"			switch (address & 0xffff) {"+"				case 0:  return 0x00;"+"				case 1:  return "+((suffix==8||suffix==9)?"0xb0":"0x89")+";"+"				case 2:  return 0x00;"+"				case 3:  return "+((suffix==9&&state.large_flash_memory)?"0xb0":"0xb5")+";"+"				default: return 0xff;"+"			}"+"		}"+"		else {"+"			if ((address & 1) == 0) {"+"				return ((state.rom[(address - "+flashmemoryaddress+") >>> 1] >>> 8) | state.flash_ret_or) & 0xFF;"+"			}"+"			else {"+"				return (state.rom[(address - "+flashmemoryaddress+"- 1) >>> 1] | state.flash_ret_or) & 0xFF;"+"			}"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		return read_hreg(address);"+"	}"+"}";eval(memory_read_function);}
build_memory_read_functions("1",0x400000,0x200000);build_memory_read_functions("3",0x200000,0x200000);build_memory_read_functions("8",0x200000,0x400000);build_memory_read_functions("9",0x800000,(state.large_flash_memory?0x800000:0x400000));function rl(address)
{var high_word=rw(address);var low_word=rw(address+2);return((high_word*65536+low_word));}
function build_memory_write_functions(suffix,flashmemoryaddress,flashmemorysize)
{var memory_write_function="ww_"+suffix+"_normal = function ww_"+suffix+"_normal(address, value)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 0; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		state.ram[(address & 0x3FFFF) >>> 1] = value;"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		if ((state.pc < 0x40000) && !state.Protection_enabled) {"+"			ww = ww_"+suffix+"_flashspecial;"+"			rw = rw_"+suffix+"_flashspecial;"+"			rb = rb_"+suffix+"_flashspecial;"+"			ww_"+suffix+"_flashspecial(address, value);"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		write_hreg(address, (value >> 8) & 0xFF);"+"		write_hreg(address + 1, value & 0xFF);"+"	}"+"}";eval(memory_write_function);memory_write_function="wb_"+suffix+"_normal = function wb_"+suffix+"_normal(address, value)"+"{"+"	address = address & 0xFFFFFF;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		address &= 0x3FFFF;"+"		if ((address & 1) == 0) {"+"			state.ram[address >>> 1] = (state.ram[address >>> 1] & 0xFF) + (value * 256);"+"		}"+"		else {"+"			state.ram[address >>> 1] = (state.ram[address >>> 1] & 0xFF00) + value;"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		write_hreg(address, value & 0xFF);"+"	}"+"}";eval(memory_write_function);memory_write_function="ww_"+suffix+"_flashspecial = function ww_"+suffix+"_flashspecial(address, value)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 0; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (address < "+((suffix!="9")?"0x200000":"0x40000")+") {"+"		state.ram[(address & 0x3FFFF) >>> 1] = value;"+"	}"+"	else if (address >= "+flashmemoryaddress+" && address < "+(flashmemoryaddress+flashmemorysize)+") {"+"		if (state.flash_write_ready) {"+"			state.rom[(address - "+flashmemoryaddress+") >>> 1] &= value;"+"			state.flash_write_ready--;"+"			state.flash_ret_or = 4294967295;"+"		}"+"		else if (value == 0x5050) {"+"			state.flash_write_phase = 0x50;"+"		}"+"		else if (value == 0x9090) {"+"			state.flash_write_phase = 0x90;"+"		}"+"		else if (value == 0x1010) {"+"			if (state.flash_write_phase == 0x50) {"+"				state.flash_write_ready = 1;"+"				state.flash_write_phase = 0x50;"+"			}"+"		}"+"		else if (value == 0x2020) {"+"			if (state.flash_write_phase == 0x50) {"+"				state.flash_write_phase = 0x20;"+"			}"+"		}"+"		else if (value == 0xD0D0) {"+"			if (state.flash_write_phase == 0x20) {"+"				state.flash_write_phase = 0xd0;"+"				state.flash_ret_or = 4294967295;"+"				address &= 0xFF0000;"+"				address -= "+flashmemoryaddress+";"+"				address >>>= 1;"+"				for (var i = 0; i < 65536/2; i++, address++) {"+"					state.rom[address] = 0xFFFF;"+"				}"+"			}"+"		}"+"		else if (value == 0xFFFF) {"+"			if (state.flash_write_phase == 0x50 || state.flash_write_phase == 0x90) {"+"				state.flash_write_ready = 0;"+"				state.flash_ret_or = 0;"+"				ww = ww_"+suffix+"_normal;"+"				rw = rw_"+suffix+"_normal;"+"				rb = rb_"+suffix+"_normal;"+"			}"+"		}"+"	}"+"	else if (address >= 0x600000 && address < 0x800000) {"+"		write_hreg(address, (value >> 8) & 0xFF);"+"		write_hreg(address + 1, value & 0xFF);"+"	}"+"}";eval(memory_write_function);}
build_memory_write_functions("1",0x400000,0x200000);build_memory_write_functions("3",0x200000,0x200000);build_memory_write_functions("8",0x200000,0x400000);build_memory_write_functions("9",0x800000,(state.large_flash_memory?0x800000:0x400000));function wl(address,value)
{ww(address,value>>>16);ww(address+2,value&0xFFFF);}
function store_multiple(address,mask,size){}
function store_multiple_predec(address,mask,size){}
function load_multiple_postinc(address,mask,size){}
function load_multiple(address,mask,size){}
function build_movem_handlers(){var reg;var movem_handler="store_multiple = function store_multiple(address, mask, size) {"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 0; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (size == 1) {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			ww(address, state.d"+reg+");"+"			address += 2;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			ww(address, state.a"+reg+");"+"			address += 2;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			ww(address, state.a"+reg+");"+"			address += 2;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	else {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			wl(address, state.d"+reg+");"+"			address += 4;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			wl(address, state.a"+reg+");"+"			address += 4;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			wl(address, state.a"+reg+");"+"			address += 4;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"}";eval(movem_handler);movem_handler="store_multiple_predec = function store_multiple_predec(address, mask, size)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 0; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (size == 1) {";for(reg=7;reg>=0;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 2;"+"			ww(address, state.a"+reg+");"+"		}"+"		mask >>>= 1;";}
for(reg=7;reg>=4;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 2;"+"			ww(address, state.d"+reg+");"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return address;";for(reg=3;reg>=0;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 2;"+"			ww(address, state.d"+reg+");"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	else {";for(reg=7;reg>=0;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 4;"+"			wl(address, state.a"+reg+");"+"		}"+"		mask >>>= 1;";}
for(reg=7;reg>=4;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 4;"+"			wl(address, state.d"+reg+");"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return address;";for(reg=3;reg>=0;reg--){movem_handler+="		if (mask & 1) {"+"			address -= 4;"+"			wl(address, state.d"+reg+");"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	return address;"+"}";eval(movem_handler);movem_handler="load_multiple = function load_multiple(address, mask, size)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 1; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (size == 1) {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.d"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.a"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.a"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	else {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.d"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.a"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.a"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"}";eval(movem_handler);movem_handler="load_multiple_postinc = function load_multiple_postinc(address, mask, size)"+"{"+"	if ((address & 1) != 0) { state.address_error_address = address; state.address_error_access_type = 1; fire_cpu_exception(3); };"+"	address = address & 0xFFFFFE;"+"	if (size == 1) {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.d"+reg+"= + value;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.a"+reg+"= + value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return address;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = ewl(rw(address));"+"			address += 2;"+"			state.a"+reg+"= + value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	else {";for(reg=0;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.d"+reg+"= value;"+"		}"+"		mask >>>= 1;";}
for(reg=0;reg<=3;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.a"+reg+"= + value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="if (!mask) return address;";for(reg=4;reg<=7;reg++){movem_handler+="		if (mask & 1) {"+"			var value = rl(address);"+"			address += 4;"+"			state.a"+reg+"= + value;"+"		}"+"		mask >>>= 1;";}
movem_handler+="	}"+"	return address;"+"}";eval(movem_handler);}
build_movem_handlers();function initemu()
{state.sr=0;stdlib.console.log("JS TI-68k emulator by PatrickD, Lionel Debroux et. al starting");if(!checkemu()){stdlib.console.log("Emulation checks failed");return;}
if(!detect_calculator_model()){stdlib.console.log("Couldn't detect calculator model");ui.display_no_rom_loaded();return;}
ui.setCalculatorModel(state.calculator_model);link.setCalculatorModel(state.calculator_model);ui.initemu();initialize_calculator();main_interval_timer_id=stdlib.setInterval(emu_main_loop,state.main_interval_timer_interval);for(var key=0;key<80;key++)state.keystatus[key]=0;ui.initkeyhandlers();};function setKey(keynumber,status)
{state.keystatus[keynumber]=status;}
function setONKeyPressed()
{state.port_60001A=0x00;raise_interrupt(6);}
function setONKeyReleased()
{state.port_60001A=0x02;}
function detect_calculator_model()
{if(typeof(state.rom)!=="object"){return false;}
state.jmp_tbl=state.rom[(0x12088+0xC8)>>>1]*65536+state.rom[((0x12088+0xC8)>>>1)+1];state.pedrom=(state.rom[(0x12088+0x32)>>>1]==0x524F);state.punix=(state.jmp_tbl==0);var OSsize;switch(state.rom[0x12000>>>1]){case 0x800F:{OSsize=state.rom[0x12002>>>1]*65536+state.rom[0x12004>>>1];if(state.rom[0x12006>>>1]==0x8011){state.calculator_model=(state.rom[0x12008>>>1]&0xFF00)>>>8;}
else{stdlib.console.log("Unhandled calculator model scheme or invalid data");return false;}
break;}
case 0x800E:{OSsize=state.rom[0x12002>>>1];if(state.rom[0x12004>>>1]==0x8011){state.calculator_model=(state.rom[0x12006>>>1]&0xFF00)>>>8;}
else{stdlib.console.log("Unhandled calculator model scheme or invalid data");return false;}
break;}
default:{stdlib.console.log("Unhandled OS size scheme or invalid data");return false;}}
switch(state.calculator_model){case 1:state.ROM_base=0x400000;state.FlashMemorySize=0x200000;break;case 3:state.ROM_base=0x200000;state.FlashMemorySize=0x200000;break;case 8:state.ROM_base=0x200000;state.FlashMemorySize=0x400000;break;case 9:state.ROM_base=0x800000;state.FlashMemorySize=(state.large_flash_memory?0x800000:0x400000);break;default:return false;}
var hwpbaddress=state.rom[0x104/2]*65536+state.rom[0x106/2];if(hwpbaddress>=state.ROM_base&&hwpbaddress<=state.ROM_base+state.FlashMemorySize){var hwpboffset=(hwpbaddress-state.ROM_base)>>>1;var hwpbsize=state.rom[hwpboffset];if(hwpbsize>=6){state.calculator_model=state.rom[hwpboffset+1]*65536+state.rom[hwpboffset+2];if(state.calculator_model==8&&state.ROM_base==0x400000){stdlib.console.log("Detected V200 ROM patched as 92+, forcing 92+ model");state.calculator_model=1;state.FlashMemorySize=0x200000;}
else if(state.calculator_model==9&&state.ROM_base==0x200000){stdlib.console.log("Detected 89T ROM patched as 89, forcing 89 model");state.calculator_model=3;state.FlashMemorySize=0x200000;}}
if(hwpbsize>=0x18){state.hardware_model=state.rom[hwpboffset+11]*65536+state.rom[hwpboffset+12];}
else{state.hardware_model=(state.calculator_model==9)?3:((state.calculator_model==8)?2:1);}}
else{state.hardware_model=(state.calculator_model==9)?3:((state.calculator_model==8)?2:1);stdlib.console.log("Creating fake HWPB");state.rom[0x104/2]=state.ROM_base>>>16;state.rom[0x106/2]=0x0108;state.rom[0x108/2]=0x0018;state.rom[0x10A/2]=0x0000;state.rom[0x10C/2]=state.calculator_model;state.rom[0x10E/2]=0x0000;state.rom[0x110/2]=0x0001;state.rom[0x112/2]=0x0000;state.rom[0x114/2]=0x0001;state.rom[0x116/2]=0x0000;state.rom[0x118/2]=0x0001;state.rom[0x11A/2]=0x0000;state.rom[0x11C/2]=0x0001;state.rom[0x11E/2]=0x0000;state.rom[0x120/2]=state.hardware_model;}
stdlib.console.log("Detected a supported OS, calculator model is "+state.calculator_model+", hardware model is "+state.hardware_model);return true;}
var reset=false;function initialize_calculator()
{reset_calculator();reset();}
function reset_calculator()
{if(state.erase_ram_upon_reset){for(var b=0;b<131072;b++){state.ram[b]=0;}}
ui.reset();for(var i=0;i<128;i++)state.ram[i]=state.rom[i+(0x12088/2)];if(state.calculator_model==1){rb=rb_1_normal;rw=rw_1_normal;wb=wb_1_normal;ww=ww_1_normal;}
else if(state.calculator_model==3){rb=rb_3_normal;rw=rw_3_normal;wb=wb_3_normal;ww=ww_3_normal;}
else if(state.calculator_model==8){rb=rb_8_normal;rw=rw_8_normal;wb=wb_8_normal;ww=ww_8_normal;}
else if(state.calculator_model==9){rb=rb_9_normal;rw=rw_9_normal;wb=wb_9_normal;ww=ww_9_normal;}
else{stdlib.console.log("Invalid calculator type");}
var initial_ssp=state.rom[0]*65536+state.rom[1];var initial_pc=state.rom[2]*65536+state.rom[3];if(initial_ssp>=0&&initial_ssp<0x40000&&initial_pc>=state.ROM_base&&initial_pc<state.ROM_base+state.FlashMemorySize&&state.rom[0x10000>>>1]==0xFFF8){stdlib.console.log("Detected reasonably valid initial SSP="+to_hex(initial_ssp,8)+", PC="+to_hex(initial_pc,8)+" in boot code, and marker in certificate memory: will boot from boot code");state.pc=initial_pc;state.prev_pc=state.pc;state.a7=initial_ssp;state.a8=initial_ssp;}
else{initial_ssp=state.rom[0x12088>>>1]*65536+state.rom[0x1208A>>>1];initial_pc=state.rom[0x1208C>>>1]*65536+state.rom[0x1208E>>>1];if(initial_ssp>=0&&initial_ssp<0x40000&&initial_pc>=state.ROM_base&&initial_pc<state.ROM_base+state.FlashMemorySize){stdlib.console.log("Detected reasonably valid initial SSP="+to_hex(initial_ssp,8)+" and PC="+to_hex(initial_pc,8)+" in OS, will boot from there");state.pc=initial_pc;state.prev_pc=state.pc;state.a7=initial_ssp;state.a8=initial_ssp;}
else{stdlib.console.log("Detected no valid initial SSP and PC !");}}
state.sr=0x2700;state.cycle_count=0;link.reset_arrays();}
function raise_interrupt(i)
{if(state.stopped)
{if(i==6||i==7)
{stdlib.console.log("Resuming from stop due to AUTO_INT_6 or AUTO_INT_7, wakemask="+to_hex(state.wakemask,2));state.stopped=false;}
else
{if(state.wakemask&(1<<(i-1)))
{state.stopped=false;}}}
state.pending_ints|=1<<i;}
function fire_cpu_exception(e)
{if(e>=25&&e<=30)
{var interrupt_level=e-24;var current_level=(state.sr&0x700)>>8;if(current_level>=interrupt_level)
{return;}}
var oldsr=state.sr;update_sr(state.sr|0x2000);state.a7-=4;wl(state.a7,state.pc);state.a7-=2;ww(state.a7,oldsr);state.pc=rl(e*4);if(e==2||e==3){state.a7-=2;ww(state.a7,state.current_instruction);state.a7-=4;wl(state.a7,state.address_error_address);state.a7-=2;var access_type=state.address_error_access_type<<4+state.reading_instruction<<3;if(oldsr&0x2000){state.address_error_access_type|=4;}
if(state.reading_instruction){state.address_error_access_type|=2;}
else{state.address_error_access_type|=1;}
ww(state.a7,state.address_error_access_type);console.log(to_hex(rw(state.a7),4)+" "+to_hex(rw(state.a7+2),4)+" "+to_hex(rw(state.a7+4),4)+" "+to_hex(rw(state.a7+6),4)+" "+to_hex(rw(state.a7+8),4)+" "+to_hex(rw(state.a7+10),4)+" "+to_hex(rw(state.a7+12),4));}
if(e>=25&&e<=31){state.sr&=0xF8FF;var new_level=e-24;state.pending_ints&=255-(1<<new_level);state.sr+=new_level*256;}}
function timer_interrupts()
{state.osc2_counter+=32;if(state.osc2_counter>=0x1000000)state.osc2_counter-=0x1000000;if((state.interrupt_control&0x80)==0)
{if(state.interrupt_control&2)
{if((state.osc2_counter&0x7FF)==0)
raise_interrupt(1);if(((state.osc2_counter%state.interrupt_rate)==0)&&(state.interrupt_control&8))
{if(state.timer_current==0)
state.timer_current=state.timer_min;else
state.timer_current++;if(state.timer_current>=256)
{state.timer_current=0;raise_interrupt(5);}}}
if((state.osc2_counter&0x7FFFF)==0&&(state.interrupt_control&4)&&((state.hardware_model==1&&(state.interrupt_control&2))||(state.hardware_model>1)))
{raise_interrupt(3);}}}
function execute_instructions(number)
{var t=cpu.t;var cycles=cpu.cycles;for(var inner=0;inner<number;inner++){state.prev_pc=state.pc;state.reading_instruction=0;state.current_instruction=rw(state.pc);if(typeof(state.current_instruction)==="undefined"){print_status();stdlib.console.log(to_hex(state.pc,9));stdlib.clearInterval(main_interval_timer_id);throw"e";}
state.reading_instruction=1;if(state.tracecount>0){state.tracecount--;if(state.overall>0){state.overall--;print_status();}}
state.pc+=2;state.cycle_count+=cycles[state.current_instruction];t[state.current_instruction]();if(state.stopped==true){return;}
if(state.pending_ints){var mask=0x80;for(var level=7;level!=0;level--){if(state.pending_ints&mask){if((level>(state.sr&0x700)>>8)||(level==7)){fire_cpu_exception(level+24);state.pending_ints&=255-(1<<level);}}
mask>>=1;}}}}
function emu_main_loop()
{if(state.unhandled_count>=10)return;var starttime=(new Date).getTime();var started=false;for(var outer=0;outer<state.screen_height*2;outer++)
{if(!state.stopped)
{execute_instructions(64);}
timer_interrupts();link.link_handling();}
if(state.hardware_model==1){ui.draw_screen(((state.lcd_address_high<<8)+state.lcd_address_low)<<(3-1),state.ram);}
else{ui.draw_screen(state.lcd_address>>>1,state.ram);}
toggle_framesync();var endtime=(new Date).getTime();state.total_time+=(endtime-starttime);state.frames_counted++;if(state.frames_counted==1000)
{ui.set_title("Average milliseconds for the last 1000 frames is "+(state.total_time/1000));state.total_time=state.frames_counted=0;}
if(newromready)
{handle_newromready();}
if(newfileready)
{handle_newfileready();}
if(newflashfileready)
{handle_newflashfileready();}}
function handle_newromready()
{var inputrom=newromready.result;newromready=false;var buf=new Uint8Array(inputrom);if(inputrom.byteLength==0x200000||inputrom.byteLength==0x400000)
{stdlib.console.log("Processing plain ROM image");rom=new Uint16Array(inputrom.byteLength/2);for(var x=0;x<inputrom.byteLength;x+=2)
{state.rom[x/2]=buf[x]*256+buf[x+1];}
initemu();}
else
{stdlib.console.log("Processing TIB/9XU image");var start=0;if(buf[0]==0x2A&&buf[1]==0x2A&&buf[2]==0x54&&buf[3]==0x49&&buf[4]==0x46&&buf[5]==0x4C&&buf[6]==0x2A&&buf[7]==0x2A)
{for(var test=0;test<inputrom.byteLength-8;test++)
{if(buf[test]==0x62&&buf[test+1]==0x61&&buf[test+2]==0x73&&buf[test+3]==0x65&&buf[test+4]==0x63&&buf[test+5]==0x6f&&buf[test+6]==0x64&&buf[test+7]==0x65)
{start=test+0x3d;break;}}}
stdlib.console.log("Offset = "+start);state.rom=new Uint16Array(0x800000/2);var offset=0;for(offset=0;offset<0x12000/2;offset++){state.rom[offset]=5120;}
for(var x=start;x<inputrom.byteLength;x+=2)
{state.rom[offset]=buf[x]*256+buf[x+1];offset++;}
while(offset<state.rom.length){state.rom[offset]=0xFFFF;offset++;}
initemu();state.rom=state.rom.subarray(0,state.FlashMemorySize/2);}}
function handle_newfileready()
{var buf;if(typeof(newfileready)=="object"){if(newfileready instanceof Array){buf=newfileready;}
else{buf=new Uint8Array(newfileready.result);}}
newfileready=false;var varname=new Array();for(var x=0x0A;x<0x12;x++)
{if(buf[x]==0)break;varname.push(buf[x]);}
varname.push(0x5c);for(var x=0x40;x<0x48;x++)
{if(buf[x]==0)break;varname.push(buf[x]);}
var vartype=buf[0x48];if(buf[0x49]==1){vartype=0x26;}
else if(buf[0x49]==2||buf[0x49]==3){vartype=0x27;}
var data_len=buf[0x57]+buf[0x56]*256;link.sendfile(varname,vartype,buf,data_len,0x58,true);}
function handle_newflashfileready()
{var buf;if(typeof(newflashfileready)=="object"){if(newflashfileready instanceof Array){buf=newflashfileready;}
else{buf=new Uint8Array(newflashfileready.result);}}
newflashfileready=false;var varname=new Array();for(var x=0x11;x<0x19;x++)
{if(buf[x]==0)break;varname.push(buf[x]);}
var vartype=buf[0x31];var data_len=buf[0x4A]+buf[0x4B]*256+buf[0x4C]*65536+buf[0x4D]*16777216;link.sendfile(varname,vartype,buf,data_len,0x4E,false);}
function loadrom(infile)
{stdlib.console.log("starting to read file "+infile.name);var extension=infile.name.toLowerCase().substr(-4);if((infile.size==0x200000||infile.size==0x400000)&&extension==".rom")
{stdlib.console.log("Loading as plain ROM");var reader=new FileReader();reader.onload=function(){newromready=reader;state.unhandled_count=0;handle_newromready();};reader.readAsArrayBuffer(infile);}
if(infile.size>=1024&&infile.size<0x400000&&(extension==".tib"||extension==".9xu"||extension==".89u"||extension==".v2u"))
{stdlib.console.log("Starting to load as TIB / OS upgrade");var reader=new FileReader();reader.onload=function(){newromready=reader;state.unhandled_count=0;handle_newromready();};reader.readAsArrayBuffer(infile);}
if(infile.size>=80&&infile.size<70000&&(".9xa.89a.v2a".indexOf(extension)!=-1||".9xc.89c.v2c".indexOf(extension)!=-1||".9xd.89d.v2d".indexOf(extension)!=-1||".9xe.89e.v2e".indexOf(extension)!=-1||".9xf.89f.v2f".indexOf(extension)!=-1||".9xi.89i.v2i".indexOf(extension)!=-1||".9xl.89l.v2l".indexOf(extension)!=-1||".9xm.89m.v2m".indexOf(extension)!=-1||".9xp.89p.v2p".indexOf(extension)!=-1||".9xs.89s.v2s".indexOf(extension)!=-1||".9xt.89t.v2t".indexOf(extension)!=-1||".9xx.89x.v2x".indexOf(extension)!=-1||".9xy.89y.v2y".indexOf(extension)!=-1||".9xz.89z.v2z".indexOf(extension)!=-1)){stdlib.console.log("Starting to load as variable");var reader=new FileReader();reader.onload=function(){newfileready=reader;state.unhandled_count=0;handle_newfileready();};reader.readAsArrayBuffer(infile);}
if(infile.size>=80&&(".9xk.89k.v2k".indexOf(extension)!=-1)){stdlib.console.log("Starting to load as Flash variable");var reader=new FileReader();reader.onload=function(){newflashfileready=reader;state.unhandled_count=0;handle_newflashfileready();};reader.readAsArrayBuffer(infile);}}
function check_ext(){var result;result=ebw(0x10);if(result!=0x10){stdlib.console.log("ext 0 "+to_hex(result,16));return false;}
result=ebw(0x80);if(result!=0xFF80){stdlib.console.log("ext 1 "+to_hex(result,16));return false;}
result=ewl(0x0100);if(result!=0x0100){stdlib.console.log("ext 2 "+to_hex(result,16));return false;}
result=ewl(0x8000);if(result!=0xFFFF8000){stdlib.console.log("ext 3 "+to_hex(result,16));return false;}
return true;}
function check_subb(){var result;return true;}
function check_cmpb(){var result;return true;}
function check_addb(){var result;return true;}
function check_subw(){var result;return true;}
function check_cmpw(){var result;return true;}
function check_addw(){var result;return true;}
function check_subl(){var result;result=subl(0x12345678,0x12345678);if(result!=0x0||state.sr!=4){stdlib.console.log("subl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0x1234567,0x12345678);if(result!=0x11111111||state.sr!=0){stdlib.console.log("subl 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0x23456789,0x12345678);if(result!=0xEEEEEEEF||state.sr!=0x19){stdlib.console.log("subl 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0x12345678,0xFF000000);if(result!=0xECCBA988||state.sr!=0x08){stdlib.console.log("subl 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0xFF000000,0x12345678);if(result!=0x13345678||state.sr!=0x11){stdlib.console.log("subl 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0x7FFFFFFF,0x7FFFFFFF);if(result!=0||state.sr!=4){stdlib.console.log("subl 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0x7FFFFFFF,0xFF000000);if(result!=0x7F000001||state.sr!=0x02){stdlib.console.log("subl 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=subl(0xFF000018,0xFF000000);if(result!=0xFFFFFFE8||state.sr!=0x19){stdlib.console.log("subl 7 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_cmpl(){var result;state.sr=0;result=cmpl(0x12345678,0x12345678);if(result!=0x0||state.sr!=4){stdlib.console.log("cmpl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=cmpl(0x1234567,0x12345678);if(result!=0x11111111||state.sr!=0){stdlib.console.log("cmpl 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=cmpl(0x23456789,0x12345678);if(result!=0xEEEEEEEF||state.sr!=0x09){stdlib.console.log("cmpl 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0x10;result=cmpl(0x12345678,0xFF000000);if(result!=0xECCBA988||state.sr!=0x18){stdlib.console.log("cmpl 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=cmpl(0xFF000000,0x12345678);if(result!=0x13345678||state.sr!=0x11){stdlib.console.log("cmpl 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=cmpl(0x7FFFFFFF,0xFF000000);if(result!=0x7F000001||state.sr!=0x12){stdlib.console.log("cmpl 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=cmpl(0xFF000018,0xFF000000);if(result!=0xFFFFFFE8||state.sr!=0x9){stdlib.console.log("cmpl 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=cmpl(0xFF000000,0x320);if(state.sr!=0x1){stdlib.console.log("cmpl 7 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_addl(){var result;result=addl(0x12345678,0x12345678);if(result!=0x2468ACF0||state.sr!=0){stdlib.console.log("addl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0x1234567,0x12345678);if(result!=0x13579BDF||state.sr!=0){stdlib.console.log("addl 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0x23456789,0x12345678);if(result!=0x3579BE01||state.sr!=0){stdlib.console.log("addl 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0x12345678,0xFF000000);if(result!=0x11345678||state.sr!=0x11){stdlib.console.log("addl 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0x7FFFFFFF,0x7FFFFFFF);if(result!=0xFFFFFFFE||state.sr!=0xA){stdlib.console.log("addl 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0x7FFFFFFF,0xFF000000);if(result!=0x7EFFFFFF||state.sr!=0x11){stdlib.console.log("addl 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=addl(0xFF000018,0xFF000000);if(result!=0xFE000018||state.sr!=0x19){stdlib.console.log("addl 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_abcd(){var result;state.sr=4;result=abcd(0x00,0x00);if(result!=0x0||state.sr!=4){stdlib.console.log("abcd 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=abcd(0x00,0x00);if(result!=0x0||state.sr!=0){stdlib.console.log("abcd 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=abcd(0x00,0x01);if(result!=0x1||state.sr!=0){stdlib.console.log("abcd 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=4;result=abcd(0x01,0x01);if(result!=0x2||state.sr!=0){stdlib.console.log("abcd 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=4;result=abcd(0x01,0x09);if(result!=0x10||state.sr!=0){stdlib.console.log("abcd 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=12;result=abcd(0x01,0x99);if(result!=0x00||state.sr!=0x15){stdlib.console.log("abcd 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0x11;result=abcd(0x00,0x99);if(result!=0x00||state.sr!=0x11){stdlib.console.log("abcd 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=abcd(0x00,0x99);if(result!=0x00||state.sr!=0x11){stdlib.console.log("abcd 7 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_sbcd(){var result;state.sr=4;result=sbcd(0x00,0x00);if(result!=0x0||state.sr!=4){stdlib.console.log("sbcd 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=sbcd(0x00,0x00);if(result!=0x0||state.sr!=0){stdlib.console.log("sbcd 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=sbcd(0x00,0x01);if(result!=0x99||(state.sr&0x15)!=0x11){stdlib.console.log("sbcd 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=sbcd(0x01,0x01);if(result!=0x99||(state.sr&0x15)!=0x11){stdlib.console.log("sbcd 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=sbcd(0x01,0x01);if(result!=0x0||state.sr!=0x0){stdlib.console.log("sbcd 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_nbcd(){var result;state.sr=4;result=nbcd(0x00);if(result!=0x0||state.sr!=4){stdlib.console.log("nbcd 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x01);if(result!=0x99||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=nbcd(0x02);if(result!=0x97||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x09);if(result!=0x91||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x0A);if(result!=0x90||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x0F);if(result!=0x8B||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x10);if(result!=0x90||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x1F);if(result!=0x7B||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 7 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=nbcd(0x11);if(result!=0x89||(state.sr&0x15)!=0x11){stdlib.console.log("nbcd 8 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_addx(){var result;return true;}
function check_subx(){var result;return true;}
function check_muls()
{var result;state.sr=0;result=muls(0x0,0x0);if(result!=0||state.sr!=4){stdlib.console.log("muls 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0x0,0x1);if(result!=0||state.sr!=4){stdlib.console.log("muls 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0x1,0x0);if(result!=0||state.sr!=4){stdlib.console.log("muls 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0x1,0x1);if(result!=1||state.sr!=0){stdlib.console.log("muls 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0x1,0x10001);if(result!=1||state.sr!=0){stdlib.console.log("muls 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0x10001,0x10001);if(result!=1||state.sr!=0){stdlib.console.log("muls 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=muls(0xFFFF,0xFFFF);if(result!=0x00000001||state.sr!=0){stdlib.console.log("muls 6 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=muls(0xFFFF,0x7FFF);if(result!=0xFFFF8001||state.sr!=8){stdlib.console.log("muls 7 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=muls(0x7FFF,0x7FFF);if(result!=0x3FFF0001||state.sr!=0){stdlib.console.log("muls 8 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=muls(0x7FFF,0xFFFF);if(result!=0xFFFF8001||state.sr!=8){stdlib.console.log("muls 9 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
return true;}
function check_mulu()
{var result;state.sr=0;result=mulu(0x0,0x0);if(result!=0||state.sr!=4){stdlib.console.log("mulu 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0x0,0x1);if(result!=0||state.sr!=4){stdlib.console.log("mulu 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0x1,0x0);if(result!=0||state.sr!=4){stdlib.console.log("mulu 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0x1,0x1);if(result!=1||state.sr!=0){stdlib.console.log("mulu 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0x1,0x10001);if(result!=1||state.sr!=0){stdlib.console.log("mulu 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0x10001,0x10001);if(result!=1||state.sr!=0){stdlib.console.log("mulu 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=mulu(0xFFFF,0xFFFF);if(result!=0xFFFE0001||state.sr!=8){stdlib.console.log("mulu 6 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=mulu(0xFFFF,0x7FFF);if(result!=0x7FFE8001||state.sr!=0){stdlib.console.log("mulu 7 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=mulu(0x7FFF,0x7FFF);if(result!=0x3FFF0001||state.sr!=0){stdlib.console.log("mulu 8 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
result=mulu(0x7FFF,0xFFFF);if(result!=0x7FFE8001||state.sr!=0){stdlib.console.log("mulu 9 "+to_hex(state.sr,4)+" "+to_hex2(result,16));return false;}
return true;}
function check_divu(){var result;state.sr=0;result=divu(0x10,0x12345678);if(result!=0x12345678||(state.sr&3)!=2){stdlib.console.log("divu 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0x10,0xFF000000);if(result!=0xFF000000||(state.sr&3)!=2){stdlib.console.log("divu 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0xCCCCFFFF,0xFF000000);if(result!=0xFF00FF00||state.sr!=0x8){stdlib.console.log("divu 2 "+to_hex2(result,9)+" "+to_hex2(0xFF00FF00,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0x1,0x10000);if(result!=0x10000||(state.sr&3)!=2){stdlib.console.log("divu 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0x10,0x10000);if(result!=0x1000||state.sr!=0){stdlib.console.log("divu 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0x10001,0x10);if(result!=0x00000010||state.sr!=0){stdlib.console.log("divu 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divu(0x10100,0x10);if(result!=0x00100000||state.sr!=4){stdlib.console.log("divu 6 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_divs()
{var result;state.sr=0;result=divs(0x10,0x12345678);if(result!=0x12345678||(state.sr&3)!=2){stdlib.console.log("divs 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0x10,0xFF000000);if(result!=0xFF000000||(state.sr&3)!=2){stdlib.console.log("divs 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0xCCCCFFFF,0x7F000000);if(result!=0x7F000000||(state.sr&3)!=2){stdlib.console.log("divs 2 "+to_hex2(result,9)+" "+to_hex2(0x7F000000,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0xCCCCFFFF,0xFF000000);if(result!=0xFF000000||(state.sr&3)!=2){stdlib.console.log("divs 3 "+to_hex2(result,9)+" "+to_hex2(0xFF00FF00,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0xCCCC7FFF,0x7F000000);if(result!=0x7F000000||(state.sr&3)!=2){stdlib.console.log("divs 4 "+to_hex2(result,9)+" "+to_hex2(0xFF00FF00,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0xCCCC7FFF,0x7E000000);if(result!=0x7E000000||(state.sr&3)!=2){stdlib.console.log("divs 5 "+to_hex2(result,9)+" "+to_hex2(0x7E000000,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0xCCCC7FFF,0x3F000000);if(result!=0x7E007E00||state.sr!=0){stdlib.console.log("divs 6 "+to_hex2(result,9)+" "+to_hex2(0x7E007E00,9)+" "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0x1,0x10000);if(result!=0x10000||(state.sr&3)!=2){stdlib.console.log("divs 7 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0x10,0x10000);if(result!=0x1000||state.sr!=0){stdlib.console.log("divs 8 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0x10001,0x10);if(result!=0x00000010||state.sr!=0){stdlib.console.log("divs 9 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=divs(0x10100,0x10);if(result!=0x00100000||state.sr!=4){stdlib.console.log("divs 10 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_lsl()
{var result;state.sr=0;result=lsl(0x80000000,1,2);if(result!=0x00000000||state.sr!=0x15){stdlib.console.log("lsl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_asl()
{var result;state.sr=0;result=asl(0x80000000,1,2);if(result!=0x00000000||state.sr!=0x17){stdlib.console.log("asl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_lsr()
{var result;return true;}
function check_asr()
{var result;return true;}
function check_ror()
{var result;return true;}
function check_rol()
{var result;state.sr=0;result=rol(0x80000000,1,2);if(result!=0x00000001||state.sr!=0x1){stdlib.console.log("rol 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=rol(0x8000,1,1);if(result!=0x0001||state.sr!=0x1){stdlib.console.log("rol 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=rol(0x80,1,0);if(result!=0x01||state.sr!=0x1){stdlib.console.log("rol 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function check_roxr()
{var result;return true;}
function check_roxl()
{var result;state.sr=0;result=roxl(0x80000000,1,2);if(result!=0x00000000||state.sr!=0x15){stdlib.console.log("roxl 0 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=roxl(0x80000000,1,2);if(result!=0x00000001||state.sr!=0x11){stdlib.console.log("roxl 1 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=roxl(0x8000,1,1);if(result!=0x0000||state.sr!=0x15){stdlib.console.log("roxl 2 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=roxl(0x8000,1,1);if(result!=0x0001||state.sr!=0x11){stdlib.console.log("roxl 3 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
state.sr=0;result=roxl(0x80,1,0);if(result!=0x00||state.sr!=0x15){stdlib.console.log("roxl 4 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
result=roxl(0x80,1,0);if(result!=0x01||state.sr!=0x11){stdlib.console.log("roxl 5 "+to_hex(state.sr,4)+" "+to_hex(result,16));return false;}
return true;}
function checkemu()
{return check_ext()&&check_subb()&&check_cmpb()&&check_addb()&&check_subw()&&check_cmpw()&&check_addw()&&check_subl()&&check_cmpl()&&check_addl()&&check_abcd()&&check_sbcd()&&check_nbcd()&&check_addx()&&check_subx()&&check_muls()&&check_mulu()&&check_divu()&&check_divs()&&check_lsl()&&check_asl()&&check_lsr()&&check_asr()&&check_ror()&&check_rol()&&check_roxr()&&check_roxl();};function setRom(newrom){state.rom=newrom;}
function setReset(newreset){reset=newreset;}
function setUI(newui){ui=newui;}
function setLink(newlink){link=newlink;}
function get_d0(){return state.d0;}
function set_d0(value){state.d0=value&4294967295;}
function get_d1(){return state.d1;}
function set_d1(value){state.d1=value&4294967295;}
function get_d2(){return state.d2;}
function set_d2(value){state.d2=value&4294967295;}
function get_d3(){return state.d3;}
function set_d3(value){state.d3=value&4294967295;}
function get_d4(){return state.d4;}
function set_d4(value){state.d4=value&4294967295;}
function get_d5(){return state.d5;}
function set_d5(value){state.d5=value&4294967295;}
function get_d6(){return state.d6;}
function set_d6(value){state.d6=value&4294967295;}
function get_d7(){return state.d7;}
function set_d7(value){state.d7=value&4294967295;}
function get_a0(){return state.a0;}
function set_a0(value){state.a0=value&4294967295;}
function get_a1(){return state.a1;}
function set_a1(value){state.a1=value&4294967295;}
function get_a2(){return state.a2;}
function set_a2(value){state.a2=value&4294967295;}
function get_a3(){return state.a3;}
function set_a3(value){state.a3=value&4294967295;}
function get_a4(){return state.a4;}
function set_a4(value){state.a4=value&4294967295;}
function get_a5(){return state.a5;}
function set_a5(value){state.a5=value&4294967295;}
function get_a6(){return state.a6;}
function set_a6(value){state.a6=value&4294967295;}
function get_a7(){return state.a7;}
function set_a7(value){state.a7=value&4294967295;}
function get_a8(){return state.a8;}
function set_a8(value){state.a8=value&4294967295;}
function get_sr(){return state.sr;}
function set_sr(value){state.sr=value&65535;}
function get_pc(){return state.pc;}
function set_pc(value){state.pc=value&4294967295;}
function get_rom(){return state.rom;}
function get_ram(){return state.ram;}
function get_t(){return cpu.t;}
function get_n(){return cpu.n;}
function get_cycles(){return cpu.cycles;}
function get_rb(){return rb;}
function get_rw(){return rw;}
function get_rl(){return rl;}
function get_wb(){return wb;}
function get_ww(){return ww;}
function get_wl(){return wl;}
function get_rb_1_normal(){return rb_1_normal;}
function get_rb_1_flashspecial(){return rb_1_flashspecial;}
function get_rw_1_normal(){return rw_1_normal;}
function get_rw_1_flashspecial(){return rw_1_flashspecial;}
function get_wb_1_normal(){return wb_1_normal;}
function get_ww_1_normal(){return ww_1_normal;}
function get_ww_1_flashspecial(){return ww_1_flashspecial;}
function get_rb_3_normal(){return rb_3_normal;}
function get_rb_3_flashspecial(){return rb_3_flashspecial;}
function get_rw_3_normal(){return rw_3_normal;}
function get_rw_3_flashspecial(){return rw_3_flashspecial;}
function get_wb_3_normal(){return wb_3_normal;}
function get_ww_3_normal(){return ww_3_normal;}
function get_ww_3_flashspecial(){return ww_3_flashspecial;}
function get_rb_8_normal(){return rb_8_normal;}
function get_rb_8_flashspecial(){return rb_8_flashspecial;}
function get_rw_8_normal(){return rw_8_normal;}
function get_rw_8_flashspecial(){return rw_8_flashspecial;}
function get_wb_8_normal(){return wb_8_normal;}
function get_ww_8_normal(){return ww_8_normal;}
function get_ww_8_flashspecial(){return ww_8_flashspecial;}
function get_rb_9_normal(){return rb_9_normal;}
function get_rb_9_flashspecial(){return rb_9_flashspecial;}
function get_rw_9_normal(){return rw_9_normal;}
function get_rw_9_flashspecial(){return rw_9_flashspecial;}
function get_wb_9_normal(){return wb_9_normal;}
function get_ww_9_normal(){return ww_9_normal;}
function get_ww_9_flashspecial(){return ww_9_flashspecial;}
function get_newfileready(){return newfileready;}
function setNewfileready(newnewfileready){newfileready=newnewfileready;}
function get_newflashfileready(){return newflashfileready;}
function setNewflashfileready(newnewflashfileready){newflashfileready=newnewflashfileready;}
function set_erase_ram_upon_reset(value){state.erase_ram_upon_reset=value;}
function get_stopped(){return state.stopped;}
function get_hardware_model(){return state.hardware_model;}
function get_calculator_model(){return state.calculator_model;}
function get_jmp_tbl(){return state.jmp_tbl;}
function get_ROM_base(){return state.ROM_base;}
function get_FlashMemorySize(){return state.FlashMemorySize;}
function pause_emulator()
{stdlib.clearInterval(main_interval_timer_id);}
function increase_emulator_speed()
{if(state.main_interval_timer_interval>1){state.main_interval_timer_interval--;stdlib.console.log("Setting main timer interval to "+state.main_interval_timer_interval+" ms.");stdlib.clearInterval(main_interval_timer_id);main_interval_timer_id=stdlib.setInterval(emu_main_loop,state.main_interval_timer_interval);}}
function decrease_emulator_speed()
{state.main_interval_timer_interval++;stdlib.console.log("Setting main timer interval to "+state.main_interval_timer_interval+" ms.");stdlib.clearInterval(main_interval_timer_id);main_interval_timer_id=stdlib.setInterval(emu_main_loop,state.main_interval_timer_interval);}
function resume_emulator()
{main_interval_timer_id=stdlib.setInterval(emu_main_loop,state.main_interval_timer_interval);}
function toggle_framesync()
{state.port_70001D^=0x80;}
function apiversion()
{return 1;}
return{apiversion:apiversion,initemu:initemu,initialize_calculator:initialize_calculator,newfileready:get_newfileready,setNewfileready:setNewfileready,newflashfileready:get_newflashfileready,setNewflashfileready:setNewflashfileready,setRom:setRom,setReset:setReset,setUI:setUI,setLink:setLink,loadrom:loadrom,setKey:setKey,setONKeyPressed:setONKeyPressed,setONKeyReleased:setONKeyReleased,pause_emulator:pause_emulator,resume_emulator:resume_emulator,set_erase_ram_upon_reset:set_erase_ram_upon_reset,increase_emulator_speed:increase_emulator_speed,decrease_emulator_speed:decrease_emulator_speed,raise_interrupt:raise_interrupt,fire_cpu_exception:fire_cpu_exception,emu_main_loop:emu_main_loop,to_hex:to_hex,to_hex2:to_hex2,memory_dump:memory_dump,print_status:print_status,print_status2:print_status2,disassemble:disassemble,ROM_CALL:ROM_CALL,HeapDeref:HeapDeref,HeapSize:HeapSize,PrintHeap:PrintHeap,d0:get_d0,d1:get_d1,d2:get_d2,d3:get_d3,d4:get_d4,d5:get_d5,d6:get_d6,d7:get_d7,a0:get_a0,a1:get_a1,a2:get_a2,a3:get_a3,a4:get_a4,a5:get_a5,a6:get_a6,a7:get_a7,a8:get_a8,sr:get_sr,pc:get_pc,dn:dn,an:an,set_d0:set_d0,set_d1:set_d1,set_d2:set_d2,set_d3:set_d3,set_d4:set_d4,set_d5:set_d5,set_d6:set_d6,set_d7:set_d7,set_a0:set_a0,set_a1:set_a1,set_a2:set_a2,set_a3:set_a3,set_a4:set_a4,set_a5:set_a5,set_a6:set_a6,set_a7:set_a7,set_a8:set_a8,set_sr:set_sr,set_pc:set_pc,rom:get_rom,ram:get_ram,t:get_t,n:get_n,cycles:get_cycles,rb:get_rb,rw:get_rw,rl:get_rl,wb:get_wb,ww:get_ww,wl:get_wl,rb_1_normal:get_rb_1_normal,rb_1_flashspecial:get_rb_1_flashspecial,rw_1_normal:get_rw_1_normal,rw_1_flashspecial:get_rw_1_flashspecial,wb_1_normal:get_wb_1_normal,ww_1_normal:get_ww_1_normal,ww_1_flashspecial:get_ww_1_flashspecial,rb_3_normal:get_rb_3_normal,rb_3_flashspecial:get_rb_3_flashspecial,rw_3_normal:get_rw_3_normal,rw_3_flashspecial:get_rw_3_flashspecial,wb_3_normal:get_wb_3_normal,ww_3_normal:get_ww_3_normal,ww_3_flashspecial:get_ww_3_flashspecial,rb_8_normal:get_rb_8_normal,rb_8_flashspecial:get_rb_8_flashspecial,rw_8_normal:get_rw_8_normal,rw_8_flashspecial:get_rw_8_flashspecial,wb_8_normal:get_wb_8_normal,ww_8_normal:get_ww_8_normal,ww_8_flashspecial:get_ww_8_flashspecial,rb_9_normal:get_rb_9_normal,rb_9_flashspecial:get_rb_9_flashspecial,rw_9_normal:get_rw_9_normal,rw_9_flashspecial:get_rw_9_flashspecial,wb_9_normal:get_wb_9_normal,ww_9_normal:get_ww_9_normal,ww_9_flashspecial:get_ww_9_flashspecial,stopped:get_stopped,hardware_model:get_hardware_model,calculator_model:get_calculator_model,jmp_tbl:get_jmp_tbl,ROM_base:get_ROM_base,FlashMemorySize:get_FlashMemorySize,toggle_framesync:toggle_framesync,_save_state:_save_state,_restore_state:_restore_state};}
function TI68kEmulatorLinkModule(stdlib){var emu=false;var ui=false;var calculator_model=1;var link_incoming_queue=new Array();var link_outgoing_queue=new Array();var link_config=1;var transmit_finished=false;var reset_upon_ack_with_len=true;var link_recv_varsize=0;var link_recv_vartype=0;var link_recv_varname="";var link_recv_foldername="";var link_recv_data=new Array();var link_recv_mode=0;var link_dirlist_vars=new Array();var link_dirlist_folders=new Array();var link_dirlist_apps=new Array();var link_dirlist_curidx=0;var link_pending_keys=new Array();var link_interval_timer_id=0;function _save_state()
{var emustate=new Object();return emustate;}
function _restore_state(linkstate)
{if(typeof(linkstate)==="object"){stdlib.clearInterval(link_interval_timer_id);}
else{stdlib.console.log("Refusing to restore state from something not an object / from an object without the expected sub-objects");}}
function setUI(newui)
{ui=newui;}
function setEmu(newemu)
{emu=newemu;}
function setCalculatorModel(model)
{calculator_model=model;}
function compute_link_status()
{var status=0;if(link_incoming_queue.length>0&&typeof(link_incoming_queue[0])=="number"){status|=0x32;}
else if(link_config&2){status|=0x50;}
return status;}
function read_byte()
{if(link_incoming_queue.length>0&&typeof(link_incoming_queue[0])=="number")
{return link_incoming_queue.shift();}
else
{return 0;}}
function write_byte(value)
{link_outgoing_queue.push(value);transmit_finished=true;}
function reset_arrays()
{link_incoming_queue=new Array();link_outgoing_queue=new Array();}
function dump_incoming_queue(header)
{var dump=header;for(var y=0;y<link_incoming_queue.length;y++)
{if(typeof(link_incoming_queue[y])=="number"){dump+=emu.to_hex(link_incoming_queue[y],2)+" ";}
else{dump+=link_incoming_queue[y]+" ";}}
stdlib.console.log(dump);}
function dump_outgoing_queue(header)
{var dump=header;for(var y=0;y<link_outgoing_queue.length;y++)
{if(typeof(link_outgoing_queue[y])=="number"){dump+=emu.to_hex(link_outgoing_queue[y],2)+" ";}
else{dump+=link_outgoing_queue[y]+" ";}}
stdlib.console.log(dump);}
function ti89_send_ACK()
{link_incoming_queue.push(8,0x56,0,0);}
function ti89_recv_ACK()
{link_incoming_queue.push('WAIT_ACK');}
function ti89_send_CTS()
{link_incoming_queue.push(8,0x09,0,0);}
function ti89_recv_CTS()
{link_incoming_queue.push('WAIT_CTS');}
function ti89_send_CNT()
{link_incoming_queue.push(8,0x78,0,0);}
function ti89_recv_CNT()
{link_incoming_queue.push('WAIT_CNT');}
function ti89_send_EOT()
{link_incoming_queue.push(8,0x92,0,0);}
function ti89_send_KEY(keycode)
{link_incoming_queue.push(8,0x87);link_incoming_queue.push(keycode&0xFF);link_incoming_queue.push((keycode>>>8)&0xFF);}
function ti89_send_XDP(data_section_len,chunk_len,buf,offset,write_both_checksum_and_length)
{link_incoming_queue.push(8,0x15);var data_checksum=0;link_incoming_queue.push(data_section_len%256,data_section_len>>>8);if(write_both_checksum_and_length){link_incoming_queue.push(0,0,0,0);link_incoming_queue.push((chunk_len>>>8)&0xFF,chunk_len%256);data_checksum=(chunk_len%256)+((chunk_len>>>8)&0xFF);}
for(var x=offset;x<offset+chunk_len;x++)
{link_incoming_queue.push(buf[x]);data_checksum+=buf[x];}
link_incoming_queue.push(data_checksum%256,(data_checksum>>>8)%256);}
function ti89_recv_XDP()
{link_incoming_queue.push('WAIT_XDP');}
function ti89_recv_VAR()
{link_incoming_queue.push('WAIT_VAR');}
function ti89_send_REQ(length,varname,vartype)
{link_incoming_queue.push(8,0xA2);if(typeof(varname)=="string"){var bytes=new Array();for(var i=0;i<varname.length;++i){bytes.push(varname.charCodeAt(i)&0xFF);}
varname=bytes;}
var header_len=varname.length+6;if(vartype==0x18){header_len++;}
link_incoming_queue.push(header_len,0);link_incoming_queue.push(length%256,(length>>>8)&0xFF,(length>>>16)&0xFF,(length>>>24)&0xFF);link_incoming_queue.push(vartype);link_incoming_queue.push(varname.length);var header_checksum=varname.length+vartype+(length%256)+((length>>>8)&0xFF)+((length>>>16)&0xFF)+((length>>>24)&0xFF);for(var x=0;x<varname.length;x++)
{link_incoming_queue.push(varname[x]);header_checksum+=varname[x];}
link_incoming_queue.push(header_checksum%256,header_checksum>>>8);}
function ti89_send_RTS(length,varname,vartype)
{link_incoming_queue.push(8,0xC9);var header_len=varname.length+6+1;link_incoming_queue.push(header_len,0);link_incoming_queue.push(length%256,(length>>>8)&0xFF,(length>>>16)&0xFF,(length>>>24)&0xFF);link_incoming_queue.push(vartype);link_incoming_queue.push(varname.length);var header_checksum=varname.length+vartype+(length%256)+((length>>>8)&0xFF)+((length>>>16)&0xFF)+((length>>>24)&0xFF);for(var x=0;x<varname.length;x++)
{link_incoming_queue.push(varname[x]);header_checksum+=varname[x];}
link_incoming_queue.push(0);link_incoming_queue.push(header_checksum%256,header_checksum>>>8);}
function sendfile(varname,vartype,buf,data_len,offset,write_both_checksum_and_length)
{var data_len_full=data_len;if(write_both_checksum_and_length){data_len_full+=2;}
ti89_send_RTS(data_len_full,varname,vartype);do{var chunk_len=Math.min(65536,data_len);ti89_recv_ACK();ti89_recv_CTS();ti89_send_ACK();var data_section_len=chunk_len;if(write_both_checksum_and_length){data_section_len+=6;}
ti89_send_XDP(data_section_len,chunk_len,buf,offset,write_both_checksum_and_length);ti89_recv_ACK();if(chunk_len==65536){ti89_send_CNT();offset+=65536;data_len-=65536;}
else{ti89_send_EOT();}}while(chunk_len!=data_len);ti89_recv_ACK();stdlib.console.log("finished processing for sending variable");dump_incoming_queue("Incoming: "+link_incoming_queue.length+" (pseudo-)bytes\n");}
function sendkey(keycode)
{ti89_send_KEY(keycode);ti89_recv_ACK();stdlib.console.log("finished processing for sending key");dump_incoming_queue("Incoming: "+link_incoming_queue.length+" (pseudo-)bytes\n");}
function send_next_key(){if(link_pending_keys.length==0){stdlib.clearInterval(link_interval_timer_id);}
sendkey(link_pending_keys.shift());}
function sendkeys(keyarray)
{var newarray=new Array();while(keyarray.length>0){console.log("length is "+keyarray.length);var item=keyarray.shift();if(typeof(item)=='number'){console.log("found number "+item);newarray.push(item);}
else if(typeof(item)=='string'){console.log("found string "+item);for(var i=0;i<item.length;i++){newarray.push(item.charCodeAt(i));}}}
link_pending_keys=newarray;link_interval_timer_id=stdlib.setInterval(send_next_key,200);}
var MODE_RECVFILE=0;var MODE_RECVFILE_NS=1;var MODE_DIRLIST_ROOT=2;var MODE_DIRLIST_FOLDER=3;function recvfile_requestchunk()
{ti89_send_ACK();ti89_send_CTS();ti89_recv_ACK();ti89_recv_XDP();ti89_send_ACK();ti89_recv_CNT();}
function recvfile(varname,vartype)
{link_reset_recv_vars();ti89_send_REQ(0,varname,vartype);ti89_recv_ACK();link_recv_mode=MODE_RECVFILE;_recvfile_ns();}
function recvfile_ns()
{link_reset_recv_vars();link_recv_mode=MODE_RECVFILE_NS;_recvfile_ns();}
function dirlist()
{link_reset_recv_vars();link_reset_dirlist_vars();ti89_send_REQ(0x1F000000,"",0x1A);ti89_recv_ACK();link_recv_mode=MODE_DIRLIST_ROOT;_recvfile_ns();}
function dirlist_folder(foldername)
{ti89_send_REQ(0x1B000000,foldername,0x1A);ti89_recv_ACK();link_recv_mode=MODE_DIRLIST_FOLDER;_recvfile_ns();}
function _recvfile_ns()
{ti89_recv_VAR();recvfile_requestchunk();stdlib.console.log("finished processing for receiving variable / dirlist (first chunk)");dump_incoming_queue("Incoming: "+link_incoming_queue.length+" (pseudo-)bytes\n");}
function link_reset_recv_vars()
{link_recv_varsize=0;link_recv_vartype=0
link_recv_varname="";link_recv_foldername="";link_recv_data=new Array();}
function link_reset_dirlist_vars()
{link_dirlist_vars=new Array();link_dirlist_folders=new Array();link_dirlist_apps=new Array();link_dirlist_curidx=0;}
function link_reset_state(packettype)
{stdlib.console.log("Receiving "+packettype+" failed, resetting link state !");link_incoming_queue=new Array();link_outgoing_queue=new Array();link_reset_recv_vars();link_reset_dirlist_vars();emu.raise_interrupt(6);}
function link_magic_number()
{if(link_recv_vartype>=35)return"**TIFL**";if(calculator_model==1||calculator_model==9)return"**TI89**";else return"**TI92P*";}
function link_build_output_file()
{var output_file=new Array();var magic=link_magic_number();for(var i=0;i<magic.length;i++){output_file.push(magic.charCodeAt(i));}
output_file.push(0x01);output_file.push(0x00);link_recv_foldername="main";var separatoroffset=link_recv_varname.indexOf("\\");if(separatoroffset!=-1){link_recv_foldername=link_recv_varname.substr(0,Math.min(separatoroffset,8-1));link_recv_varname=link_recv_varname.substr(separatoroffset+1);if(link_recv_varname.length>8){stdlib.console.log("Invalid varname, clamping to 8 characters");link_recv_varname=link_recv_varname.substr(0,7);}}
for(var i=0;i<link_recv_foldername.length;i++){output_file.push(link_recv_foldername.charCodeAt(i));}
for(var i=8-link_recv_foldername.length;i>0;i--){output_file.push(0);}
for(var i=0;i<40;i++){output_file.push(0);}
output_file.push(0x01);output_file.push(0x00);output_file.push(0x52);output_file.push(0x00);output_file.push(0x00);output_file.push(0x00);for(var i=0;i<link_recv_varname.length;i++){output_file.push(link_recv_varname.charCodeAt(i));}
for(var i=8-link_recv_varname.length;i>0;i--){output_file.push(0);}
output_file.push(link_recv_vartype);output_file.push(0x00);output_file.push(0x00);output_file.push(0x00);var varsize=link_recv_varsize+0x52+4+2;output_file.push(varsize&0xFF);output_file.push((varsize>>>8)&0xFF);output_file.push((varsize>>>16)&0xFF);output_file.push((varsize>>>24)&0xFF);output_file.push(0xA5);output_file.push(0x5A);output_file.push(0x00);output_file.push(0x00);output_file.push(0x00);output_file.push(0x00);var checksum=0;for(var i=0;i<link_recv_data.length;i++){output_file.push(link_recv_data[i]);checksum+=link_recv_data[i];}
output_file.push(checksum&0xFF);output_file.push((checksum>>>8)&0xFF);link_recv_data=new Uint8Array(output_file);}
function process_recv_XDP(x)
{var length=link_outgoing_queue[x+2]+link_outgoing_queue[x+3]*256;dump_outgoing_queue("WAIT_XDP Before: ");var computed_checksum=link_outgoing_queue[0]+link_outgoing_queue[1]+link_outgoing_queue[2]+link_outgoing_queue[3];link_recv_varsize=link_outgoing_queue[0]+link_outgoing_queue[1]*256+link_outgoing_queue[2]*65536+link_outgoing_queue[3]*16777216;link_recv_vartype=link_outgoing_queue[4];computed_checksum+=link_outgoing_queue[4]+link_outgoing_queue[5];var strl=link_outgoing_queue[5];for(var i=0;i<strl;i++){if(link_recv_mode<MODE_DIRLIST_ROOT){link_recv_varname+=String.fromCharCode(link_outgoing_queue[6+i]);}
computed_checksum+=link_outgoing_queue[6+i];}
stdlib.console.log("link_recv_varsize = "+link_recv_varsize);stdlib.console.log("link_recv_vartype = "+link_recv_vartype);stdlib.console.log("strl = "+strl);stdlib.console.log("link_recv_varname = "+link_recv_varname);link_recv_data=new Uint8Array(link_recv_varsize&0xFFFF);var packet_checksum=link_outgoing_queue[x-2]+link_outgoing_queue[x-1]*256;if((computed_checksum&0xFFFF)!=packet_checksum){stdlib.console.log("WAIT_XDP: Wrong checksum: computed="+emu.to_hex(computed_checksum,4)+" packet="+emu.to_hex(packet_checksum,4)+"!");}
link_outgoing_queue.splice(0,x+4);link_incoming_queue.shift();stdlib.console.log("Eaten an item in WAIT_XDP",x);dump_outgoing_queue("After: ");}
function process_recv_CNTEOT(x)
{dump_outgoing_queue("WAIT_CNT Before: ");var packet_type=link_outgoing_queue[x+1];var computed_checksum=0;for(var i=4;i<(link_recv_varsize&0xFFFF)+4;i++){link_recv_data[i-4]=link_outgoing_queue[i];computed_checksum+=link_outgoing_queue[i];}
var packet_checksum=link_outgoing_queue[x-2]+link_outgoing_queue[x-1]*256;if((computed_checksum&0xFFFF)!=packet_checksum){stdlib.console.log("WAIT_CNT: Wrong checksum: computed="+emu.to_hex(computed_checksum,4)+" packet="+emu.to_hex(packet_checksum,4)+"!");}
stdlib.console.log("link_recv_data has length "+link_recv_data.length);link_outgoing_queue.splice(0,x+4);link_incoming_queue.shift();stdlib.console.log("Eaten an item in WAIT_CNT",x);if(link_recv_mode<MODE_DIRLIST_ROOT){if(packet_type==0x92){ti89_send_ACK();link_build_output_file();}
else{recvfile_requestchunk();}}
else{var extra=(calculator_model==8)?8:0;if(link_recv_mode==MODE_DIRLIST_ROOT){link_dirlist_vars=new Array();link_dirlist_folders=new Array();link_dirlist_apps=new Array();link_dirlist_curidx=0;var i=0;while(i<link_recv_data.length){var name="";for(var j=0;j<8;j++){if(link_recv_data[i+j]!=0){name+=String.fromCharCode(link_recv_data[i+j]);}
else{break;}}
var type=link_recv_data[i+8];var attr=link_recv_data[i+9];var size=link_recv_data[i+10]+(link_recv_data[i+11]*256)+(link_recv_data[i+12]*65536);stdlib.console.log("i="+i+"\tname="+name+"\ttype="+type+"\tattr="+attr+"\tsize="+size);if(type==0x1F){link_dirlist_folders.push(name);}
i+=14+extra;}
if(link_dirlist_folders.length>0){ti89_send_ACK();dirlist_folder(link_dirlist_folders[link_dirlist_curidx]);}}
else if(link_recv_mode==MODE_DIRLIST_FOLDER){stdlib.console.log("Parsing folder\""+link_dirlist_folders[link_dirlist_curidx]+"\"");var i=14+extra;while(i<link_recv_data.length){var name="";for(var j=0;j<8;j++){if(link_recv_data[i+j]!=0){name+=String.fromCharCode(link_recv_data[i+j]);}
else{break;}}
var type=link_recv_data[i+8];var attr=link_recv_data[i+9];var size=link_recv_data[i+10]+(link_recv_data[i+11]*256)+(link_recv_data[i+12]*65536);stdlib.console.log("i="+i+"\tname="+name+"\ttype="+type+"\tattr="+attr+"\tsize="+size);if(type==0x24){var j=0;var k=-1;while(j<link_dirlist_apps.length){if(link_dirlist_apps[j].name==name){k=j;break;}
j++;}
if(k==-1){var app=new Object();app.name=name;app.type=type;app.attr=attr;app.size=size;link_dirlist_apps.push(app);}}
else{if((link_dirlist_folders[link_dirlist_curidx]!="main")||(name!="regeq"&&name!="regcoef")){var newvar=new Object();newvar.name=link_dirlist_folders[link_dirlist_curidx]+"\\"+name;newvar.type=type;newvar.attr=attr;newvar.size=size;link_dirlist_vars.push(newvar);}}
i+=14+extra;}
link_dirlist_curidx++;if(link_dirlist_curidx<link_dirlist_folders.length){ti89_send_ACK();dirlist_folder(link_dirlist_folders[link_dirlist_curidx]);}}}
dump_outgoing_queue("After: ");}
function link_handling()
{var link_status=compute_link_status();if((link_config&0x40)==0)
{if(((link_config&5)&&link_incoming_queue.length>0&&typeof(link_incoming_queue[0])=="number")||((link_config&6)==6))
{emu.raise_interrupt(4);}}
if(link_incoming_queue.length>0)
{if(link_incoming_queue[0]=='WAIT_ACK')
{for(var x=0;x+4<=link_outgoing_queue.length;x++)
{if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x56)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x56))
{if((link_outgoing_queue[x+2]!=0||link_outgoing_queue[x+3]!=0)){link_reset_state("ACK");}
else{dump_outgoing_queue("WAIT_ACK Before: ");link_outgoing_queue.splice(x,x+4);link_incoming_queue.shift();stdlib.console.log("Eaten an item in WAIT_ACK",x);dump_outgoing_queue("After: ");}}}}
else if(link_incoming_queue[0]=='WAIT_CTS')
{for(var x=0;x+4<=link_outgoing_queue.length;x++)
{if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x09)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x09))
{if(link_outgoing_queue[x+2]!=0||link_outgoing_queue[x+3]!=0){link_reset_state("CTS");}
else{dump_outgoing_queue("WAIT_CTS Before: ");link_outgoing_queue.splice(0,x+4);link_incoming_queue.shift();stdlib.console.log("Eaten an item in WAIT_CTS",x);dump_outgoing_queue("After: ");}}}}
else if(link_incoming_queue[0]=='WAIT_VAR')
{for(var x=0;x+4<=link_outgoing_queue.length;x++)
{if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x06)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x06))
{var length=link_outgoing_queue[x+2]+link_outgoing_queue[x+3]*256;dump_outgoing_queue("WAIT_VAR Before: ");link_outgoing_queue.splice(0,x+4);link_incoming_queue.shift();stdlib.console.log("Eaten an item (VAR) in WAIT_VAR",x);dump_outgoing_queue("After: ");}
else if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x92)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x92))
{process_recv_CNTEOT(x);}}}
else if(link_incoming_queue[0]=='WAIT_XDP')
{for(var x=0;x+4<=link_outgoing_queue.length;x++)
{if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x15)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x15))
{process_recv_XDP(x);}}}
else if(link_incoming_queue[0]=='WAIT_CNT')
{for(var x=0;x+4<=link_outgoing_queue.length;x++)
{if((link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x78)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x78)||(link_outgoing_queue[x]==0x88&&link_outgoing_queue[x+1]==0x92)||(link_outgoing_queue[x]==0x98&&link_outgoing_queue[x+1]==0x92))
{process_recv_CNTEOT(x);}}}}};function buildFileExtensionFromVartype()
{var prefix=(calculator_model==1||calculator_model==9)?".89":((calculator_model==8)?".v2":".9x");var suffix="";switch(link_recv_vartype){case 0:suffix="e";break;case 4:suffix="l";break;case 6:suffix="m";break;case 10:suffix="c";break;case 11:suffix="t";break;case 12:suffix="s";break;case 13:suffix="d";break;case 14:suffix="a";break;case 16:suffix="i";break;case 18:suffix="p";break;case 19:suffix="f";break;case 20:suffix="x";break;case 28:suffix="y";break;case 33:suffix="z";break;case 36:suffix="k";break;default:suffix="?";break;}
return prefix+suffix;}
function getFileData()
{ui.getFileData(new Blob([link_recv_data],{type:"application/octet-binary"}));}
function get_link_config(){return link_config;}
function set_link_config(value)
{link_config=value&255;if(value&2==0)transmit_finished=false;}
function set_reset_upon_ack_with_len(value){reset_upon_ack_with_len=value;}
function get_link_incoming_queue(){return link_incoming_queue;}
function get_link_outgoing_queue(){return link_outgoing_queue;}
function get_link_recv_varsize(){return link_recv_varsize;}
function get_link_recv_vartype(){return link_recv_vartype;}
function get_link_recv_varname(){return link_recv_varname;}
function get_link_recv_foldername(){return link_recv_foldername;}
function get_link_recv_data(){return link_recv_data;}
function get_link_dirlist_vars(){return link_dirlist_vars;}
function get_link_dirlist_apps(){return link_dirlist_apps;}
return{getFileData:getFileData,setUI:setUI,setEmu:setEmu,link_handling:link_handling,setCalculatorModel:setCalculatorModel,link_incoming_queue:get_link_incoming_queue,link_outgoing_queue:get_link_outgoing_queue,dump_incoming_queue:dump_incoming_queue,dump_outgoing_queue:dump_outgoing_queue,sendfile:sendfile,sendkey:sendkey,sendkeys:sendkeys,recvfile:recvfile,recvfile_ns:recvfile_ns,dirlist:dirlist,compute_link_status:compute_link_status,read_byte:read_byte,write_byte:write_byte,reset_arrays:reset_arrays,link_recv_varsize:get_link_recv_varsize,link_recv_vartype:get_link_recv_vartype,link_recv_varname:get_link_recv_varname,link_recv_foldername:get_link_recv_foldername,link_recv_data:get_link_recv_data,link_dirlist_vars:get_link_dirlist_vars,link_dirlist_apps:get_link_dirlist_apps,buildFileExtensionFromVartype:buildFileExtensionFromVartype,get_link_config:get_link_config,set_link_config:set_link_config,set_reset_upon_ack_with_len:set_reset_upon_ack_with_len,_save_state:_save_state,_restore_state:_restore_state};}
function TI68kEmulatorUIModule(stdlib){"use strict";var frames_for_averaging=3;var calcscreen=new Uint8Array(240*128*frames_for_averaging);var frame=0;var emu=false;var link=false;var bitmap=false;var context=false;var calculator_model=1;var set_skin=function(){};var draw_calcscreen=function(address,ram){};var display_no_rom_loaded=function(){stdlib.alert("No ROM / OS loaded !");}
var screen_scaling_ratio=2;var screen_enabled=true;var contrast=0x0;var black_color=0x00;var white_color=0x50;var elementid_calcmap='calcmap';var elementid_area='area';var elementid_calcimg='calcimg';var elementid_screen='screen';var elementid_smallskin='smallskin';var elementid_largeskin='largeskin';var elementid_textandbuttons='textandbuttons';var elementid_pngimage='pngimage';var elementid_pngbutton='pngbutton';var elementid_hidebutton='hidebutton';var elementid_pauseemulator='pauseemulator';var elementid_resumeemulator='resumeemulator';var elementid_speedup='speedup';var elementid_slowdown='slowdown';var elementid_romfile='romfile';var elementid_downloadfile='downloadfile';function _save_state()
{var emustate=new Object();return emustate;}
function _restore_state(linkstate)
{if(typeof(linkstate)==="object"){}
else{stdlib.console.log("Refusing to restore state from something not an object / from an object without the expected sub-objects");}}
function draw_calcscreen_89_89T(address,ram)
{var pixel=frame;if(screen_enabled){for(var y=0;y<100;y++){for(var x=0;x<10;x++){var b=ram[address++];for(var bit=15;bit>=0;bit--){var color=b&0x8000?black_color:white_color;b<<=1;calcscreen[pixel]=color;pixel+=frames_for_averaging;}}
address+=5;pixel+=5*frames_for_averaging*16;}}
else{for(var y=0;y<128*240;y++){calcscreen[pixel]=white_color;pixel+=frames_for_averaging;}}
frame++;if(frame==frames_for_averaging)frame=0;};function draw_calcscreen_92P_V200(address,ram)
{var pixel=frame;if(screen_enabled){for(var y=0;y<128;y++){for(var x=0;x<15;x++){var b=ram[address++];for(var bit=15;bit>=0;bit--){var color=b&0x8000?black_color:white_color;b<<=1;calcscreen[pixel]=color;pixel+=frames_for_averaging;}}}}
else{for(var y=0;y<128*240;y++){calcscreen[pixel]=white_color;pixel+=frames_for_averaging;}}
frame++;if(frame==frames_for_averaging)frame=0;};function output_calcscreen_to_bitmap_scale1(calcscreen,buff)
{var pixel=0;var p=0;for(var y=0;y<128;y++){for(var x=0;x<240;x++){var color=0;for(var i=0;i<frames_for_averaging;i++){color+=calcscreen[pixel++];}
buff[p]=color;buff[p+1]=color;buff[p+2]=color;p+=4;}}};function output_calcscreen_to_bitmap_scale2(calcscreen,buff)
{var pixel=0;var p=0;for(var y=0;y<128;y++){for(var x=0;x<240;x++){var color=0;for(var i=0;i<frames_for_averaging;i++){color+=calcscreen[pixel++];}
buff[p]=color;buff[p+1]=color;buff[p+2]=color;buff[p+4]=color;buff[p+5]=color;buff[p+6]=color;buff[p+1920]=color;buff[p+1921]=color;buff[p+1922]=color;buff[p+1924]=color;buff[p+1925]=color;buff[p+1926]=color;p+=8;}
p+=1920;}};function output_calcscreen_to_bitmap_scale3(calcscreen,buff)
{var pixel=0;var p=0;for(var y=0;y<128;y++){for(var x=0;x<240;x++){var color=0;for(var i=0;i<frames_for_averaging;i++){color+=calcscreen[pixel++];}
buff[p]=color;buff[p+1]=color;buff[p+2]=color;buff[p+4]=color;buff[p+5]=color;buff[p+6]=color;buff[p+8]=color;buff[p+9]=color;buff[p+10]=color;buff[p+2880]=color;buff[p+2881]=color;buff[p+2882]=color;buff[p+2884]=color;buff[p+2885]=color;buff[p+2886]=color;buff[p+2888]=color;buff[p+2889]=color;buff[p+2890]=color;buff[p+5760]=color;buff[p+5761]=color;buff[p+5762]=color;buff[p+5764]=color;buff[p+5765]=color;buff[p+5766]=color;buff[p+5768]=color;buff[p+5769]=color;buff[p+5770]=color;p+=12;}
p+=5760;}};function output_calcscreen_to_bitmap_scale4(calcscreen,buff)
{var pixel=0;var p=0;for(var y=0;y<3840*128;y+=3840){for(var x=0;x<240;x++){var color=0;for(var i=0;i<frames_for_averaging;i++){color+=calcscreen[pixel++];}
buff[p]=color;buff[p+1]=color;buff[p+2]=color;buff[p+4]=color;buff[p+5]=color;buff[p+6]=color;buff[p+8]=color;buff[p+9]=color;buff[p+10]=color;buff[p+12]=color;buff[p+13]=color;buff[p+14]=color;buff[p+3840]=color;buff[p+3841]=color;buff[p+3842]=color;buff[p+3844]=color;buff[p+3845]=color;buff[p+3846]=color;buff[p+3848]=color;buff[p+3849]=color;buff[p+3850]=color;buff[p+3852]=color;buff[p+3853]=color;buff[p+3854]=color;buff[p+7680]=color;buff[p+7681]=color;buff[p+7682]=color;buff[p+7684]=color;buff[p+7685]=color;buff[p+7686]=color;buff[p+7688]=color;buff[p+7689]=color;buff[p+7690]=color;buff[p+7692]=color;buff[p+7693]=color;buff[p+7694]=color;buff[p+11520]=color;buff[p+11521]=color;buff[p+11522]=color;buff[p+11524]=color;buff[p+11525]=color;buff[p+11526]=color;buff[p+11528]=color;buff[p+11529]=color;buff[p+11530]=color;buff[p+11532]=color;buff[p+11533]=color;buff[p+11534]=color;p+=16;}
p+=11520;}};function draw_screen(address,ram)
{draw_calcscreen(address,ram);if(screen_scaling_ratio==1){output_calcscreen_to_bitmap_scale1(calcscreen,bitmap.data);context.putImageData(bitmap,0,0);}
else if(screen_scaling_ratio==2){output_calcscreen_to_bitmap_scale2(calcscreen,bitmap.data);context.putImageData(bitmap,0,0);}
else if(screen_scaling_ratio==3){output_calcscreen_to_bitmap_scale3(calcscreen,bitmap.data);context.putImageData(bitmap,0,0);}
else if(screen_scaling_ratio==4){output_calcscreen_to_bitmap_scale4(calcscreen,bitmap.data);context.putImageData(bitmap,0,0);}};function create_button(shape,coords,keynumber)
{var map=document.getElementById(elementid_calcmap);var area=document.createElement(elementid_area);area.shape=shape;area.coords=coords;area.onmousedown=function(){emu.setKey(keynumber,1);}
area.ontouchstart=function(){emu.setKey(keynumber,1);}
area.onmouseup=function(){emu.setKey(keynumber,0);}
area.ontouchend=function(){emu.setKey(keynumber,0);}
area.ontouchleave=function(){emu.setKey(keynumber,0);}
area.ontouchcancel=function(){emu.setKey(keynumber,0);}
map.appendChild(area);}
function create_on_button(shape,coords)
{var map=document.getElementById(elementid_calcmap);var area=document.createElement(elementid_area);area.shape=shape;area.coords=coords;area.onmousedown=function(){emu.setONKeyPressed();}
area.ontouchstart=function(){emu.setONKeyPressed();}
area.onmouseup=function(){emu.setONKeyReleased();}
area.ontouchend=function(){emu.setONKeyReleased();}
area.ontouchleave=function(){emu.setONKeyReleased();}
area.ontouchcancel=function(){emu.setONKeyReleased();}
map.appendChild(area);}
function handle_keys_89_89T(event)
{var e=event||stdlib.event;e.preventDefault();var value;switch(e.type){case'keydown':value=1;break;case'keyup':value=0;break;default:return true;}
switch(e.keyCode)
{case 38:emu.setKey(0,value);break;case 37:emu.setKey(1,value);break;case 40:emu.setKey(2,value);break;case 39:emu.setKey(3,value);break;case 18:emu.setKey(4,value);break;case 192:emu.setKey(4,value);break;case 16:emu.setKey(5,value);break;case 17:emu.setKey(6,value);break;case 13:emu.setKey(8,value);break;case 43:emu.setKey(9,value);break;case 107:emu.setKey(9,value);break;case 45:emu.setKey(10,value);break;case 109:emu.setKey(10,value);break;case 42:emu.setKey(11,value);break;case 106:emu.setKey(11,value);break;case 47:emu.setKey(12,value);break;case 111:emu.setKey(12,value);break;case 46:emu.setKey(14,value);break;case 116:emu.setKey(15,value);break;case 59:emu.setKey(16,value);break;case 186:emu.setKey(16,value);break;case 51:emu.setKey(17,value);break;case 99:emu.setKey(17,value);break;case 54:emu.setKey(18,value);break;case 102:emu.setKey(18,value);break;case 57:emu.setKey(19,value);break;case 105:emu.setKey(19,value);break;case 84:emu.setKey(21,value);break;case 8:emu.setKey(22,value);break;case 115:emu.setKey(23,value);break;case 190:emu.setKey(24,value);break;case 50:emu.setKey(25,value);break;case 98:emu.setKey(25,value);break;case 53:emu.setKey(26,value);break;case 101:emu.setKey(26,value);break;case 56:emu.setKey(27,value);break;case 104:emu.setKey(27,value);break;case 90:emu.setKey(29,value);break;case 117:emu.setKey(30,value);break;case 114:emu.setKey(31,value);break;case 119:emu.setKey(31,value);break;case 48:emu.setKey(32,value);break;case 96:emu.setKey(32,value);break;case 49:emu.setKey(33,value);break;case 97:emu.setKey(33,value);break;case 52:emu.setKey(34,value);break;case 100:emu.setKey(34,value);break;case 55:emu.setKey(35,value);break;case 101:emu.setKey(35,value);break;case 89:emu.setKey(37,value);break;case 113:emu.setKey(39,value);break;case 118:emu.setKey(39,value);break;case 120:emu.setKey(40,value);break;case 45:emu.setKey(42,value);break;case 88:emu.setKey(45,value);break;case 112:emu.setKey(47,value);break;case 27:emu.setKey(48,value);break;case 145:if(value==1)emu.setONKeyPressed();else emu.setONKeyReleased();break;case 85:emu.setKey(7,value);emu.setKey(9,value);break;case 79:emu.setKey(7,value);emu.setKey(10,value);break;case 74:emu.setKey(7,value);emu.setKey(11,value);break;case 69:emu.setKey(7,value);emu.setKey(12,value);break;case 83:emu.setKey(7,value);emu.setKey(17,value);break;case 78:emu.setKey(7,value);emu.setKey(18,value);break;case 73:emu.setKey(7,value);emu.setKey(19,value);break;case 68:emu.setKey(7,value);emu.setKey(20,value);break;case 87:emu.setKey(7,value);emu.setKey(24,value);break;case 82:emu.setKey(7,value);emu.setKey(25,value);break;case 77:emu.setKey(7,value);emu.setKey(26,value);break;case 72:emu.setKey(7,value);emu.setKey(27,value);break;case 67:emu.setKey(7,value);emu.setKey(28,value);break;case 86:emu.setKey(7,value);emu.setKey(32,value);break;case 81:emu.setKey(7,value);emu.setKey(33,value);break;case 76:emu.setKey(7,value);emu.setKey(34,value);break;case 71:emu.setKey(7,value);emu.setKey(35,value);break;case 66:emu.setKey(7,value);emu.setKey(36,value);break;case 80:emu.setKey(7,value);emu.setKey(41,value);break;case 75:emu.setKey(7,value);emu.setKey(42,value);break;case 70:emu.setKey(7,value);emu.setKey(43,value);break;case 65:emu.setKey(7,value);emu.setKey(44,value);break;}
return true;}
function handle_keys_92P_V200(event)
{var e=event||stdlib.event;e.preventDefault();var value;switch(e.type){case'keydown':value=1;break;case'keyup':value=0;break;default:return true;}
switch(e.keyCode)
{case 18:emu.setKey(0,value);break;case 192:emu.setKey(0,value);break;case 17:emu.setKey(1,value);break;case 16:emu.setKey(2,value);break;case 20:emu.setKey(3,value);break;case 220:emu.setKey(3,value);break;case 37:emu.setKey(4,value);break;case 38:emu.setKey(5,value);break;case 39:emu.setKey(6,value);break;case 40:emu.setKey(7,value);break;case 90:emu.setKey(9,value);break;case 83:emu.setKey(10,value);break;case 87:emu.setKey(11,value);break;case 119:emu.setKey(12,value);break;case 49:emu.setKey(13,value);break;case 97:emu.setKey(13,value);break;case 50:emu.setKey(14,value);break;case 98:emu.setKey(14,value);break;case 51:emu.setKey(15,value);break;case 99:emu.setKey(15,value);break;case 88:emu.setKey(17,value);break;case 68:emu.setKey(18,value);break;case 69:emu.setKey(19,value);break;case 114:emu.setKey(20,value);break;case 52:emu.setKey(21,value);break;case 100:emu.setKey(21,value);break;case 53:emu.setKey(22,value);break;case 101:emu.setKey(22,value);break;case 54:emu.setKey(23,value);break;case 102:emu.setKey(23,value);break;case 67:emu.setKey(25,value);break;case 70:emu.setKey(26,value);break;case 82:emu.setKey(27,value);break;case 118:emu.setKey(28,value);break;case 55:emu.setKey(29,value);break;case 103:emu.setKey(29,value);break;case 56:emu.setKey(30,value);break;case 104:emu.setKey(30,value);break;case 57:emu.setKey(31,value);break;case 105:emu.setKey(31,value);break;case 32:emu.setKey(32,value);break;case 86:emu.setKey(33,value);break;case 71:emu.setKey(34,value);break;case 84:emu.setKey(35,value);break;case 113:emu.setKey(36,value);break;case 47:emu.setKey(40,value);break;case 111:emu.setKey(40,value);break;case 66:emu.setKey(41,value);break;case 72:emu.setKey(42,value);break;case 89:emu.setKey(43,value);break;case 117:emu.setKey(44,value);break;case 78:emu.setKey(49,value);break;case 74:emu.setKey(50,value);break;case 85:emu.setKey(51,value);break;case 112:emu.setKey(52,value);break;case 80:emu.setKey(55,value);break;case 77:emu.setKey(57,value);break;case 75:emu.setKey(58,value);break;case 73:emu.setKey(59,value);break;case 116:emu.setKey(60,value);break;case 46:emu.setKey(61,value);break;case 120:emu.setKey(62,value);break;case 42:emu.setKey(63,value);break;case 106:emu.setKey(63,value);break;case 8:emu.setKey(64,value);break;case 76:emu.setKey(66,value);break;case 79:emu.setKey(67,value);break;case 43:emu.setKey(68,value);break;case 107:emu.setKey(68,value);break;case 27:emu.setKey(70,value);break;case 45:emu.setKey(72,value);break;case 109:emu.setKey(72,value);break;case 13:emu.setKey(73,value);break;case 65:emu.setKey(74,value);break;case 81:emu.setKey(75,value);break;case 115:emu.setKey(76,value);break;case 48:emu.setKey(77,value);break;case 96:emu.setKey(77,value);break;case 190:emu.setKey(78,value);break;case 59:emu.setKey(79,value);break;case 186:emu.setKey(79,value);break;case 145:if(value==1)emu.setONKeyPressed();else emu.setONKeyReleased();break;}
return true;}
function initkeyhandlers()
{if(calculator_model==3||calculator_model==9)
{document.onkeydown=handle_keys_89_89T;document.onkeyup=handle_keys_89_89T;}
else
{document.onkeydown=handle_keys_92P_V200;document.onkeyup=handle_keys_92P_V200;}}
function set_large_92p_skin()
{screen_scaling_ratio=2;var oldimg=document.getElementById(elementid_calcimg);var newimg=document.createElement('img');newimg.setAttribute('id',elementid_calcimg);newimg.setAttribute('src','Ti-92plus.jpg');newimg.setAttribute('usemap','#'+elementid_calcmap);newimg.setAttribute('style','position:absolute;top:0px;left:0px;z-index:0');oldimg.parentNode.appendChild(newimg);newimg.parentNode.removeChild(oldimg);var screen=document.getElementById(elementid_screen);screen.setAttribute('style','position:absolute;top:49px;left:205px;z-index:1');screen.setAttribute('width','480');screen.setAttribute('height','256');var textandbuttons=document.getElementById(elementid_textandbuttons);textandbuttons.setAttribute('style','position:relative;top:578px');document.getElementById(elementid_smallskin).checked=false;document.getElementById(elementid_largeskin).checked=true;var oldmap=document.getElementById(elementid_calcmap);var newmap=document.createElement('map');newmap.setAttribute('name',elementid_calcmap);newmap.setAttribute('id',elementid_calcmap);oldmap.parentNode.appendChild(newmap);newmap.parentNode.removeChild(oldmap);create_button('rect','140,52,193,112',3);create_button('rect','871,69,920,108',5);create_button('rect','871,157,920,196',7);create_button('rect','834,110,872,156',4);create_button('rect','921,110,971,156',6);create_button('rect','724,55,768,95',0);create_button('rect','200,497,246,527',0);create_button('rect','137,497,183,527',1);create_button('rect','74,450,120,480',2);create_button('rect','137,451,183,481',9);create_button('rect','168,401,214,431',10);create_button('rect','136,353,182,393',11);create_button('rect','141,271,184,311',12);create_button('rect','724,453,770,483',13);create_button('rect','784,453,830,483',14);create_button('rect','845,453,891,483',15);create_button('rect','200,450,246,480',17);create_button('rect','232,402,278,432',18);create_button('rect','199,354,245,384',19);create_button('rect','75,218,118,259',20);create_button('rect','724,405,770,435',21);create_button('rect','785,405,830,435',22);create_button('rect','845,405,891,431',23);create_button('rect','264,499,310,529',24);create_button('rect','263,450,309,480',25);create_button('rect','294,403,340,433',26);create_button('rect','264,354,310,384',27);create_button('rect','141,219,184,259',28);create_button('rect','724,357,770,387',29);create_button('rect','785,357,830,387',30);create_button('rect','845,357,891,387',31);create_button('rect','327,499,495,529',32);create_button('rect','326,450,372,480',33);create_button('rect','357,403,403,433',34);create_button('rect','327,354,373,384',35);create_button('rect','75,168,118,208',36);create_button('rect','723,306,768,336',37);create_button('rect','784,306,830,336',38);create_button('rect','844,307,890,337',39);create_button('rect','904,307,950,337',40);create_button('rect','388,452,434,483',41);create_button('rect','421,403,467,433',42);create_button('rect','389,355,435,385',43);create_button('rect','141,168,184,208',44);create_button('rect','724,260,770,290',45);create_button('rect','784,260,830,290',46);create_button('rect','844,260,890,290',47);create_button('rect','905,260,951,290',48);create_button('rect','453,451,499,481',49);create_button('rect','484,403,530,433',50);create_button('rect','452,355,498,385',51);create_button('rect','75,119,118,159',52);create_button('rect','723,211,769,241',53);create_button('rect','846,201,949,239',54);create_button('rect','642,356,688,386',55);create_button('rect','516,500,562,530',56);create_button('rect','515,451,561,481',57);create_button('rect','547,403,593,433',58);create_button('rect','516,356,562,386',59);create_button('rect','141,119,284,159',60);create_button('rect','724,163,790,193',61);create_button('rect','785,164,828,237',62);create_button('rect','905,357,951,387',63);create_button('rect','579,499,625,529',64);create_button('rect','578,451,624,481',65);create_button('rect','610,403,656,433',66);create_button('rect','579,356,623,386',67);create_button('rect','905,453,961,483',68);create_button('rect','724,115,770,145',69);create_button('rect','785,59,825,139',70);create_button('rect','904,404,950,434',72);create_button('rect','905,500,938,538',73);create_button('rect','624,454,685,528',73);create_button('rect','106,401,152,431',74);create_button('rect','74,353,120,383',75);create_button('rect','75,271,118,311',76);create_button('rect','724,501,770,531',77);create_button('rect','784,502,830,532',78);create_button('rect','845,501,891,531',79);create_on_button('rect','74,497,120,527');}
function set_small_92p_skin()
{screen_scaling_ratio=1;var oldimg=document.getElementById(elementid_calcimg);var newimg=document.createElement('img');newimg.setAttribute('id',elementid_calcimg);newimg.setAttribute('src','ti92p_skinmap.gif');newimg.setAttribute('usemap','#'+elementid_calcmap);newimg.setAttribute('style','position:absolute;top:0px;left:0px;z-index:0');oldimg.parentNode.appendChild(newimg);newimg.parentNode.removeChild(oldimg);var screen=document.getElementById(elementid_screen);screen.setAttribute('style','position:relative;top:27px;left:180px;z-index:1');screen.setAttribute('width','240');screen.setAttribute('height','128');var textandbuttons=document.getElementById(elementid_textandbuttons);textandbuttons.setAttribute('style','position:relative;top:200px');document.getElementById(elementid_smallskin).checked=true;document.getElementById(elementid_largeskin).checked=false;var oldmap=document.getElementById(elementid_calcmap);var newmap=document.createElement('map');newmap.setAttribute('name',elementid_calcmap);newmap.setAttribute('id',elementid_calcmap);oldmap.parentNode.appendChild(newmap);newmap.parentNode.removeChild(oldmap);create_button('rect','98,36,141,54',3);create_button('rect','42,62,85,79',52);create_button('rect','42,87,85,105',36);create_button('rect','42,113,85,131',20);create_button('rect','42,139,85,156',76);create_button('rect','98,62,141,79',60);create_button('rect','98,87,141,105',44);create_button('rect','98,113,141,131',28);create_button('rect','98,139,141,156',12);create_button('rect','2,191,35,209',75);create_button('rect','45,191,78,209',11);create_button('rect','88,191,121,209',19);create_button('rect','131,191,163,209',27);create_button('rect','173,191,206,209',35);create_button('rect','216,191,249,209',43);create_button('rect','259,191,292,209',51);create_button('rect','302,191,335,209',59);create_button('rect','344,191,379,209',67);create_button('rect','387,191,421,209',55);create_button('rect','2,244,35,261',2);create_button('rect','45,244,78,261',9);create_button('rect','88,244,121,261',17);create_button('rect','131,244,163,261',25);create_button('rect','173,244,206,261',33);create_button('rect','216,244,249,261',41);create_button('rect','259,244,292,261',49);create_button('rect','302,244,335,261',57);create_button('rect','344,244,379,261',65);create_button('rect','387,244,421,288',73);create_button('rect','45,270,78,288',1);create_button('rect','88,270,121,288',0);create_button('rect','131,270,163,288',24);create_button('rect','173,270,292,288',32);create_button('rect','302,270,335,288',56);create_button('rect','344,270,379,288',64);create_button('rect','24,217,57,235',74);create_button('rect','67,217,100,235',10);create_button('rect','110,217,143,235',18);create_button('rect','153,217,185,235',26);create_button('rect','195,217,228,235',34);create_button('rect','238,217,271,235',42);create_button('rect','281,217,314,235',50);create_button('rect','324,217,357,235',58);create_button('rect','366,217,400,235',66);create_button('rect','451,10,484,33',0);create_button('rect','451,43,484,62',69);create_button('rect','451,71,484,80',61);create_button('rect','451,100,484,110',53);create_button('rect','451,128,484,147',45);create_button('rect','491,128,523,147',46);create_button('rect','530,128,563,147',47);create_button('rect','570,128,602,147',48);create_button('rect','451,156,484,175',37);create_button('rect','491,156,523,175',38);create_button('rect','530,156,563,175',39);create_button('rect','570,156,602,175',40);create_button('rect','451,184,484,204',29);create_button('rect','491,184,523,204',30);create_button('rect','530,184,563,204',31);create_button('rect','570,184,602,204',63);create_button('rect','451,212,484,232',21);create_button('rect','491,212,523,232',22);create_button('rect','530,212,563,232',23);create_button('rect','570,212,602,232',72);create_button('rect','451,240,484,260',13);create_button('rect','491,240,523,260',14);create_button('rect','530,240,563,260',15);create_button('rect','570,240,602,260',68);create_button('rect','451,269,484,288',77);create_button('rect','491,269,523,288',78);create_button('rect','530,269,563,288',79);create_button('rect','570,269,602,288',73);create_button('poly','491,9,535,9,535,18,514,62,491,62',70);create_button('rect','491,71,523,119',62);create_button('rect','530,92,602,119',54);create_button('poly','563,54,532,27,560,15,567,15,595,27,564,54',5);create_button('poly','563,55,532,82,559,94,568,94,594,82,564,55',7);create_button('poly','563,54,532,27,520,49,520,60,532,82,563,55',4);create_button('poly','564,54,595,27,607,45,607,64,594,82,564,55',6);create_on_button('rect','2,270,35,288');}
function set_small_89_skin()
{screen_scaling_ratio=1;var oldimg=document.getElementById(elementid_calcimg);var newimg=document.createElement('img');newimg.setAttribute('id',elementid_calcimg);newimg.setAttribute('src','ti89_skinmap.gif');newimg.setAttribute('usemap','#'+elementid_calcmap);newimg.setAttribute('style','position:absolute;top:0px;left:0px;z-index:0');oldimg.parentNode.appendChild(newimg);newimg.parentNode.removeChild(oldimg);var screen=document.getElementById(elementid_screen);screen.setAttribute('style','position:relative;top:36px;left:29px;z-index:1');screen.setAttribute('width','160');screen.setAttribute('height','100');var textandbuttons=document.getElementById(elementid_textandbuttons);textandbuttons.setAttribute('style','position:relative;top:310px');document.getElementById(elementid_smallskin).checked=true;document.getElementById(elementid_largeskin).checked=false;var oldmap=document.getElementById(elementid_calcmap);var newmap=document.createElement('map');newmap.setAttribute('name',elementid_calcmap);newmap.setAttribute('id',elementid_calcmap);oldmap.parentNode.appendChild(newmap);newmap.parentNode.removeChild(oldmap);create_button('rect','23,151,51,161',47);create_button('rect','60,151,87,161',39);create_button('rect','94,151,122,161',31);create_button('rect','130,151,157,161',23);create_button('rect','166,151,194,161',15);create_button('rect','23,186,51,201',4);create_button('rect','60,186,87,201',5);create_button('rect','94,186,122,201',48);create_button('poly','132,181,143,181,149,187,149,208,143,215,132,215',1);create_button('poly','198,181,187,181,181,187,181,208,187,215,198,215',3);create_button('poly','148,171,148,182,154,188,176,188,182,182,182,171',0);create_button('poly','148,226,148,215,154,209,176,209,182,215,182,226',2);create_button('rect','23,211,51,226',6);create_button('rect','60,211,87,226',7);create_button('rect','94,211,122,226',40);create_button('rect','23,236,51,251',46);create_button('rect','60,236,87,251',38);create_button('rect','94,236,122,251',30);create_button('rect','130,236,157,251',22);create_button('rect','166,236,194,251',14);create_button('rect','23,262,51,277',45);create_button('rect','60,262,87,277',37);create_button('rect','94,262,122,277',29);create_button('rect','130,262,157,277',21);create_button('rect','166,262,194,277',13);create_button('rect','23,287,51,303',44);create_button('rect','60,287,87,303',36);create_button('rect','94,287,122,303',28);create_button('rect','130,287,157,303',20);create_button('rect','166,287,194,303',12);create_button('rect','23,314,51,328',43);create_button('rect','60,311,87,329',35);create_button('rect','94,311,122,329',27);create_button('rect','130,311,157,329',19);create_button('rect','166,314,194,328',11);create_button('rect','23,339,51,354',42);create_button('rect','60,337,87,355',34);create_button('rect','94,337,122,355',26);create_button('rect','130,337,157,355',18);create_button('rect','166,339,194,354',10);create_button('rect','23,364,51,379',41);create_button('rect','60,362,87,381',33);create_button('rect','94,362,122,381',25);create_button('rect','130,362,157,381',17);create_button('rect','166,364,194,379',9);create_button('rect','60,388,87,407',32);create_button('rect','94,388,122,407',24);create_button('rect','130,388,157,407',16);create_button('rect','166,390,194,410',8);create_on_button('rect','23,388,51,407');}
function set_small_v200_skin()
{screen_scaling_ratio=1;var oldimg=document.getElementById(elementid_calcimg);var newimg=document.createElement('img');newimg.setAttribute('id',elementid_calcimg);newimg.setAttribute('src','tiv200_skinmap.gif');newimg.setAttribute('usemap','#'+elementid_calcmap);newimg.setAttribute('style','position:absolute;top:0px;left:0px;z-index:0');oldimg.parentNode.appendChild(newimg);newimg.parentNode.removeChild(oldimg);var screen=document.getElementById(elementid_screen);screen.setAttribute('style','position:relative;top:34px;left:70px;z-index:1');screen.setAttribute('width','240');screen.setAttribute('height','128');var textandbuttons=document.getElementById(elementid_textandbuttons);textandbuttons.setAttribute('style','position:relative;top:310px');document.getElementById(elementid_smallskin).checked=true;document.getElementById(elementid_largeskin).checked=false;var oldmap=document.getElementById(elementid_calcmap);var newmap=document.createElement('map');newmap.setAttribute('name',elementid_calcmap);newmap.setAttribute('id',elementid_calcmap);oldmap.parentNode.appendChild(newmap);newmap.parentNode.removeChild(oldmap);create_button('rect','24,175,54,198',3);create_button('rect','69,180,93,192',52);create_button('rect','100,180,123,192',36);create_button('rect','131,180,154,192',20);create_button('rect','162,180,185,192',76);create_button('rect','193,180,215,192',60);create_button('rect','224,180,246,192',44);create_button('rect','254,180,277,192',28);create_button('rect','285,180,308,192',12);create_button('rect','41,207,65,221',75);create_button('rect','72,207,95,221',11);create_button('rect','103,207,126,221',19);create_button('rect','134,207,157,221',27);create_button('rect','164,207,188,221',35);create_button('rect','195,207,219,221',43);create_button('rect','226,207,250,221',51);create_button('rect','257,207,280,221',59);create_button('rect','288,207,311,221',67);create_button('rect','318,207,342,221',55);create_button('rect','41,250,65,264',2);create_button('rect','72,250,95,264',9);create_button('rect','103,250,126,264',17);create_button('rect','134,250,157,264',25);create_button('rect','164,250,188,264',33);create_button('rect','195,250,219,264',41);create_button('rect','226,250,250,264',49);create_button('rect','257,250,280,264',57);create_button('rect','288,250,311,264',65);create_button('rect','318,250,342,286',73);create_button('rect','72,272,95,286',1);create_button('rect','103,272,126,286',0);create_button('rect','134,272,157,286',24);create_button('rect','164,272,250,286',32);create_button('rect','257,272,280,286',56);create_button('rect','288,272,311,286',64);create_button('rect','58,229,81,235',74);create_button('rect','89,229,112,235',10);create_button('rect','119,229,142,235',18);create_button('rect','150,229,173,235',26);create_button('rect','181,229,204,235',34);create_button('rect','212,229,235,235',42);create_button('rect','243,229,266,235',50);create_button('rect','273,229,296,235',58);create_button('rect','304,229,327,235',66);create_button('rect','349,32,373,56',0);create_button('rect','380,32,404,79',70);create_button('rect','424,32,459,48',5);create_button('rect','349,43,373,79',69);create_button('rect','411,54,429,85',4);create_button('rect','455,54,473,85',6);create_button('rect','349,89,373,105',61);create_button('rect','424,89,459,105',7);create_button('rect','349,116,373,130',53);create_button('rect','380,95,404,130',62);create_button('rect','411,113,466,130',54);create_button('rect','349,142,373,156',45);create_button('rect','380,142,404,156',46);create_button('rect','411,142,435,156',47);create_button('rect','442,142,466,156',48);create_button('rect','349,167,373,182',37);create_button('rect','380,167,404,182',38);create_button('rect','411,167,435,182',39);create_button('rect','442,167,466,172',40);create_button('rect','349,191,373,210',29);create_button('rect','380,191,404,210',30);create_button('rect','411,191,435,210',31);create_button('rect','442,191,466,205',63);create_button('rect','349,217,373,235',21);create_button('rect','380,217,404,235',22);create_button('rect','411,217,435,235',23);create_button('rect','442,217,466,231',72);create_button('rect','349,243,373,261',13);create_button('rect','380,243,404,261',14);create_button('rect','411,243,435,261',15);create_button('rect','442,243,466,257',68);create_button('rect','349,268,373,286',77);create_button('rect','380,268,404,286',78);create_button('rect','411,268,435,286',79);create_button('rect','442,268,466,288',73);create_on_button('rect','41,272,65,286');}
function set_small_89t_skin()
{screen_scaling_ratio=1;var oldimg=document.getElementById(elementid_calcimg);var newimg=document.createElement('img');newimg.setAttribute('id',elementid_calcimg);newimg.setAttribute('src','ti89t_skinmap.gif');newimg.setAttribute('usemap','#'+elementid_calcmap);newimg.setAttribute('style','position:absolute;top:0px;left:0px;z-index:0');oldimg.parentNode.appendChild(newimg);newimg.parentNode.removeChild(oldimg);var screen=document.getElementById(elementid_screen);screen.setAttribute('style','position:relative;top:52px;left:33px;z-index:1');screen.setAttribute('width','160');screen.setAttribute('height','100');var textandbuttons=document.getElementById(elementid_textandbuttons);textandbuttons.setAttribute('style','position:relative;top:390px');document.getElementById(elementid_smallskin).checked=true;document.getElementById(elementid_largeskin).checked=false;var oldmap=document.getElementById(elementid_calcmap);var newmap=document.createElement('map');newmap.setAttribute('name',elementid_calcmap);newmap.setAttribute('id',elementid_calcmap);oldmap.parentNode.appendChild(newmap);newmap.parentNode.removeChild(oldmap);create_button('rect','30,175,51,196',47);create_button('rect','65,177,87,198',39);create_button('rect','101,178,123,199',31);create_button('rect','137,177,159,198',23);create_button('rect','173,175,194,196',15);create_button('rect','28,220,57,239',4);create_button('rect','62,225,92,243',5);create_button('rect','97,227,127,244',48);create_button('rect','135,225,157,246',1);create_button('rect','181,225,202,246',3);create_button('rect','157,205,180,235',0);create_button('rect','157,236,180,267',2);create_button('rect','28,245,57,264',6);create_button('rect','60,250,87,268',7);create_button('rect','97,252,127,269',40);create_button('rect','28,270,57,289',46);create_button('rect','60,275,87,293',38);create_button('rect','97,277,127,294',30);create_button('rect','132,275,162,293',22);create_button('rect','167,270,197,289',14);create_button('rect','28,295,57,314',45);create_button('rect','60,300,87,318',37);create_button('rect','97,302,127,319',29);create_button('rect','132,300,162,318',21);create_button('rect','167,295,197,314',13);create_button('rect','28,321,57,340',44);create_button('rect','60,326,87,344',36);create_button('rect','97,328,127,345',28);create_button('rect','132,326,162,344',20);create_button('rect','167,321,197,340',12);create_button('rect','28,346,57,365',43);create_button('rect','60,351,87,371',35);create_button('rect','97,353,127,372',27);create_button('rect','132,351,162,371',19);create_button('rect','167,346,197,365',11);create_button('rect','28,371,57,390',42);create_button('rect','60,381,87,401',34);create_button('rect','97,382,127,401',26);create_button('rect','132,381,162,401',18);create_button('rect','167,371,197,390',10);create_button('rect','28,396,57,415',41);create_button('rect','60,410,87,431',33);create_button('rect','97,412,127,431',25);create_button('rect','132,410,162,431',17);create_button('rect','167,396,197,415',9);create_button('rect','60,440,87,461',32);create_button('rect','97,442,127,461',24);create_button('rect','132,440,162,461',16);create_button('rect','167,421,197,448',8);create_on_button('rect','28,421,57,448');}
function setCalculatorModel(model)
{calculator_model=model;if(screen_scaling_ratio==1){switch(model){case 1:set_skin=set_small_92p_skin;draw_calcscreen=draw_calcscreen_92P_V200;break;case 3:set_skin=set_small_89_skin;draw_calcscreen=draw_calcscreen_89_89T;break;case 8:set_skin=set_small_v200_skin;draw_calcscreen=draw_calcscreen_92P_V200;break;case 9:set_skin=set_small_89t_skin;draw_calcscreen=draw_calcscreen_89_89T;break;default:break;}}
else{switch(model){case 1:set_skin=set_large_92p_skin;draw_calcscreen=draw_calcscreen_92P_V200;break;case 3:set_skin=set_small_89_skin;draw_calcscreen=draw_calcscreen_89_89T;break;case 8:set_skin=set_small_v200_skin;draw_calcscreen=draw_calcscreen_92P_V200;break;case 9:set_skin=set_small_89t_skin;draw_calcscreen=draw_calcscreen_89_89T;break;default:break;}}}
function reset()
{for(var p=0;p<calcscreen.length;calcscreen[p++]=0x50){};}
function setEmu(newemu){emu=newemu;}
function setLink(newlink){link=newlink;}
function setSkin(scaling){stdlib.console.log("old scaling ratio: "+screen_scaling_ratio+"\tnew scaling ratio: "+scaling);if(screen_scaling_ratio!=scaling){screen_scaling_ratio=scaling;setCalculatorModel(calculator_model);set_skin();initscreen();}}
function initscreen()
{var elem=document.getElementById(elementid_screen);context=elem.getContext('2d');if(screen_scaling_ratio==1){if(context.createImageData)
bitmap=context.createImageData(240,128);else if(context.getImageData)
bitmap=context.getImageData(0,0,960,512);else
bitmap={'width':240,'height':128,'data':new Uint8Array(240*128*4)};}
else if(screen_scaling_ratio==2){if(context.createImageData)
bitmap=context.createImageData(480,256);else if(context.getImageData)
bitmap=context.getImageData(0,0,960,512);else
bitmap={'width':480,'height':256,'data':new Uint8Array(480*256*4)};}
else if(screen_scaling_ratio==3){if(context.createImageData)
bitmap=context.createImageData(720,384);else if(context.getImageData)
bitmap=context.getImageData(0,0,960,512);else
bitmap={'width':720,'height':384,'data':new Uint8Array(720*384*4)};}
else if(screen_scaling_ratio==4){if(context.createImageData)
bitmap=context.createImageData(960,512);else if(context.getImageData)
bitmap=context.getImageData(0,0,960,512);else
bitmap={'width':960,'height':512,'data':new Uint8Array(960*512*4)};}
for(var x=3;x<bitmap.data.length;x+=4)bitmap.data[x]=255;}
function initemu(){if(!document.getElementById(elementid_calcmap)||!document.getElementById(elementid_calcimg)||!document.getElementById(elementid_screen)||!document.getElementById(elementid_pngimage)){stdlib.console.warn("A DOM element related to the calculator image wasn't found, expect problems");}
if(!document.getElementById(elementid_smallskin)||!document.getElementById(elementid_largeskin)||!document.getElementById(elementid_textandbuttons)||!document.getElementById(elementid_pngbutton)||!document.getElementById(elementid_hidebutton)||!document.getElementById(elementid_pauseemulator)||!document.getElementById(elementid_resumeemulator)||!document.getElementById(elementid_speedup)||!document.getElementById(elementid_slowdown)||!document.getElementById(elementid_downloadfile)){stdlib.console.warn("A DOM element for a button wasn't found, expect problems");}
set_skin();initscreen();}
function getPNG()
{var data=document.getElementById(elementid_screen).toDataURL('image/png');document.getElementById(elementid_pngimage).src=data;document.getElementById(elementid_pngbutton).style.display='none';document.getElementById(elementid_pngimage).style.display='inline';document.getElementById(elementid_hidebutton).style.display='inline';}
function pngButtons()
{document.getElementById(elementid_pngimage).style.display='none';document.getElementById(elementid_hidebutton).style.display='none';document.getElementById(elementid_pngbutton).style.display='inline';}
function pause_emulator()
{emu.pause_emulator();document.getElementById(elementid_pauseemulator).style.display='none';document.getElementById(elementid_resumeemulator).style.display='inline';}
function resume_emulator()
{emu.resume_emulator();document.getElementById(elementid_pauseemulator).style.display='inline';document.getElementById(elementid_resumeemulator).style.display='none';}
function loadrom()
{var infile=document.getElementById(elementid_romfile).files[0];emu.loadrom(infile);}
function set_title(title)
{document.title=title;}
function getFileData(blob)
{var url=stdlib.URL.createObjectURL(blob);var a=document.querySelector("#"+elementid_downloadfile);a.href=url;a.download=link.link_recv_foldername()+"."+link.link_recv_varname()+link.buildFileExtensionFromVartype();a.style.display='inline';}
function set_colors_according_to_contrast()
{if(emu.hardware_model()==1){black_color=white_color-5*contrast;}
else{black_color=(2*white_color-5*contrast)>>1;}}
function set_screen_enabled_and_contrast(calculator_model,hardware_model,port_60001C,port_60001D,port_70001D,port_70001F)
{if(hardware_model==1){var new_screen_enabled=((port_60001D&0x10)==0x00)||((port_60001C&0x3C)!=0x3C);if(new_screen_enabled^screen_enabled){stdlib.console.log("Changing screen state: "+new_screen_enabled+"\tpc="+emu.to_hex(emu.pc(),6)+"\thardware_model="+hardware_model+"\t60001C="+emu.to_hex(port_60001C,2)+"\t60001D="+emu.to_hex(port_60001D,2)+"\t70001D="+emu.to_hex(port_70001D,2)+"\t70001F="+emu.to_hex(port_70001F,2));}
screen_enabled=new_screen_enabled;port_60001D&=0x0F;if(calculator_model==1||calculator_model==8){port_60001D=0x10-port_60001D;}
contrast=port_60001D;set_colors_according_to_contrast();}
else{var new_screen_enabled=((port_70001D&0x2)==0x2)||((port_60001C&0x3C)!=0x3C);if(new_screen_enabled^screen_enabled){stdlib.console.log("Changing screen state: "+new_screen_enabled+"\tpc="+emu.to_hex(emu.pc(),6)+"\thardware_model="+hardware_model+"\t60001C="+emu.to_hex(port_60001C,2)+"\t60001D="+emu.to_hex(port_60001D,2)+"\t70001D="+emu.to_hex(port_70001D,2)+"\t70001F="+emu.to_hex(port_70001F,2));}
screen_enabled=new_screen_enabled;port_60001D&=(port_70001F&1)?0x1F:0x0F;if(calculator_model==1||calculator_model==8){port_60001D=((port_70001F&1)?0x20:0x10)-port_60001D;}
contrast=port_60001D;set_colors_according_to_contrast();}}
function set_frames_for_averaging(frames){if(frames==3||frames==6){frames_for_averaging=frames;calcscreen=new Uint8Array(240*128*frames_for_averaging);frame=0;white_color=(0x50/(frames_for_averaging/3));set_colors_according_to_contrast();reset();}
else{stdlib.console.warn("Unsupported number of frames for averaging");}}
function set_white_color(color){white_color=color;}
function set_black_color(color){black_color=color;}
function set_elementid_calcmap(calcmap){elementid_calcmap=calcmap;}
function set_elementid_area(area){elementid_area=area;}
function set_elementid_calcimg(calcimg){elementid_calcimg=calcimg;}
function set_elementid_screen(screen){elementid_screen=screen;}
function set_elementid_smallskin(smallskin){elementid_smallskin=smallskin;}
function set_elementid_largeskin(largeskin){elementid_largeskin=largeskin;}
function set_elementid_textandbuttons(textandbuttons){elementid_textandbuttons=textandbuttons;}
function set_elementid_pngimage(pngimage){elementid_pngimage=pngimage;}
function set_elementid_pngbutton(pngbutton){elementid_pngbutton=pngbutton;}
function set_elementid_hidebutton(hidebutton){elementid_hidebutton=hidebutton;}
function set_elementid_pauseemulator(pauseemulator){elementid_pauseemulator=pauseemulator;}
function set_elementid_resumeemulator(resumeemulator){elementid_resumeemulator=resumeemulator;}
function set_elementid_speedup(speedup){elementid_speedup=speedup;}
function set_elementid_slowdown(slowdown){elementid_slowdown=slowdown;}
function set_elementid_romfile(romfile){elementid_romfile=romfile;}
function set_elementid_downloadfile(downloadfile){elementid_downloadfile=downloadfile;}
function set_display_no_rom_loaded(func){display_no_rom_loaded=func;}
return{setSkin:setSkin,getPNG:getPNG,loadrom:loadrom,pngButtons:pngButtons,pause_emulator:pause_emulator,resume_emulator:resume_emulator,setCalculatorModel:setCalculatorModel,initkeyhandlers:initkeyhandlers,reset:reset,initemu:initemu,initscreen:initscreen,draw_screen:draw_screen,set_screen_enabled_and_contrast:set_screen_enabled_and_contrast,set_title:set_title,getFileData:getFileData,display_no_rom_loaded:display_no_rom_loaded,setEmu:setEmu,setLink:setLink,set_elementid_calcmap:set_elementid_calcmap,set_elementid_area:set_elementid_area,set_elementid_calcimg:set_elementid_calcimg,set_elementid_screen:set_elementid_screen,set_elementid_smallskin:set_elementid_smallskin,set_elementid_largeskin:set_elementid_largeskin,set_elementid_textandbuttons:set_elementid_textandbuttons,set_elementid_pngimage:set_elementid_pngimage,set_elementid_pngbutton:set_elementid_pngbutton,set_elementid_hidebutton:set_elementid_hidebutton,set_elementid_pauseemulator:set_elementid_pauseemulator,set_elementid_resumeemulator:set_elementid_resumeemulator,set_elementid_speedup:set_elementid_speedup,set_elementid_slowdown:set_elementid_slowdown,set_elementid_romfile:set_elementid_romfile,set_display_no_rom_loaded:set_display_no_rom_loaded,set_frames_for_averaging:set_frames_for_averaging,set_white_color:set_white_color,set_black_color:set_black_color,_save_state:_save_state,_restore_state:_restore_state};}
