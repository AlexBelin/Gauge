class Gauge {
    constructor(Target, ConfigObj) {
        this.Target = Target;
        this.ConfigObj = ConfigObj;
        this.Value = 0;
        this.Wrapper = document.createElement('div');
        this.Wrapper.style.position = 'relative';
        this.Canvas = document.createElement('canvas');
        this.Canvas.style.position = 'relative';
        this.Canvas.style.zIndex = '2';
        this.Incr = 0;
        if(this.ConfigObj.speed.toString().indexOf('.') != -1) {
            if(this.ConfigObj.speed.toString().split(".")[1].length <= 2) {
                this.Round = 100;
            }
            else{
                this.Round = Math.pow(10, this.ConfigObj.speed.toString().split(".")[1].length);
            }
        }
        else {
            this.Round = 100;
        }
        this.AnimGauge = null;
        this.ctx = this.Canvas.getContext('2d');
        //====================================
        this.CanvasShadow = document.createElement('canvas');
        this.CanvasShadow.style.position = 'absolute';
        this.CanvasShadow.style.top = '0';
        this.CanvasShadow.style.left = '0';
        this.CanvasShadow.style.zIndex = '1';
        this.ctxShadow = this.CanvasShadow.getContext('2d');
    }

    Render() {
        this.Wrapper.appendChild(this.Canvas);
        this.Target.appendChild(this.Wrapper);
        this.ctx.lineWidth = this.ConfigObj.stroke;
        this.ctx.strokeStyle = this.ConfigObj.color;
        //====================================
        if(this.ConfigObj.shadowMax) {
            this.Wrapper.appendChild(this.CanvasShadow);
            this.ctxShadow.lineWidth = this.ConfigObj.stroke;
            this.ctxShadow.strokeStyle = this.ConfigObj.shadowMax;
            this.RenderShadow();
        }
    }

    Refresh(_Value, _ReferenceValue) {
        window.clearInterval(this.AnimGauge);
        if(_Value > _ReferenceValue) {
            _Value = _ReferenceValue;
        }
        if(_Value < 0) {
            _Value = 0;
        }
        if(_Value < this.Value) {
            this.Incr = this.ConfigObj.speed * -1;
        }
        else {
            this.Incr = this.ConfigObj.speed;
        }
        this.RenderGauge(_Value, _ReferenceValue);
    }

    RenderGauge(_Value, _ReferenceValue) {
        this.AnimGauge = setInterval(() => {
            this.DrawGauge(_Value, _ReferenceValue);
            if(this.Value != _Value) {
                if(Math.abs(this.Value - _Value) < Math.abs(this.Incr)) {
                    this.Value = _Value;
                    this.DrawGauge(_Value, _ReferenceValue);
                    window.clearInterval(this.AnimGauge);
                }
                else {
                    this.Value = Math.round(((this.Value + this.Incr) + Number.EPSILON) * this.Round) / this.Round;
                }
            }
        });
    }
}

class GaugeLine extends Gauge {
    constructor(Target, ConfigObj) {
        super(Target, ConfigObj);
        this.CanvasWidth = this.ConfigObj.width;
        if(this.ConfigObj.displayValue) {
            this.CanvasHeight = this.ConfigObj.stroke + parseInt(this.ConfigObj.displayValue.replace( /^\D+/g, '')) + 4;
        }
        else {
            this.CanvasHeight = this.ConfigObj.stroke;
        }
        this.Canvas.setAttribute('width', this.CanvasWidth);
        this.Canvas.setAttribute('height', this.CanvasHeight);
        //====================================
        this.CanvasShadow.setAttribute('width', this.CanvasWidth);
        this.CanvasShadow.setAttribute('height', this.CanvasHeight);
    }

    DrawGauge(_Value, _ReferenceValue) {
        this.ctx.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        this.ctx.lineTo(this.Value * this.CanvasWidth / _ReferenceValue, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        if(this.ConfigObj.displayValue) {
            this.ctx.font = this.ConfigObj.displayValue;
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            var _X_TextPlace = this.Value * this.CanvasWidth / _ReferenceValue;
            if((this.Value / _ReferenceValue) < 0.5) {
                this.ctx.textAlign = 'left';
            }
            this.ctx.fillText(this.Value + '/' + _ReferenceValue, _X_TextPlace, 0);
            if(this.ConfigObj.textColor) {
                this.ctx.fillStyle = this.ConfigObj.textColor;
            }
        }
        this.ctx.stroke();
    }

    RenderShadow() {
        this.ctxShadow.beginPath();
        this.ctxShadow.moveTo(0, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        this.ctxShadow.lineTo(this.CanvasWidth, this.CanvasHeight - (this.ConfigObj.stroke / 2));
        this.ctxShadow.stroke();
    }
}

class GaugeCirc extends Gauge {
    constructor(Target, ConfigObj) {
        super(Target, ConfigObj);
        this.CanvasDim = (this.ConfigObj.radius + this.ConfigObj.stroke) * 2;
        this.Canvas.setAttribute('width', this.CanvasDim);
        this.Canvas.setAttribute('height', this.CanvasDim);
        this.StartAngle = this.ConfigObj.StartAngle * Math.PI / 180 || 0;
        this.EndAngle = this.ConfigObj.EndAngle * Math.PI / 180 || 2 * Math.PI;
        //====================================
        this.CanvasShadow.setAttribute('width', this.CanvasDim);
        this.CanvasShadow.setAttribute('height', this.CanvasDim);
    }

    DrawGauge(_Value, _ReferenceValue) {
        this.ctx.clearRect(0, 0, this.CanvasDim, this.CanvasDim);
        this.ctx.beginPath();
        this.ctx.arc(this.CanvasDim / 2, this.CanvasDim / 2, this.ConfigObj.radius, this.StartAngle, this.StartAngle + (this.Value * (this.EndAngle - this.StartAngle) / _ReferenceValue));
        if(this.ConfigObj.displayValue) {
            this.ctx.font = this.ConfigObj.displayValue;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.Value + '/' + _ReferenceValue, this.CanvasDim / 2, this.CanvasDim / 2);
            if(this.ConfigObj.textColor) {
                this.ctx.fillStyle = this.ConfigObj.textColor;
            }
        }
        this.ctx.stroke();
    }

    RenderShadow() {
        this.ctxShadow.beginPath();
        this.ctxShadow.arc(this.CanvasDim / 2, this.CanvasDim / 2, this.ConfigObj.radius, this.StartAngle, this.EndAngle);
        this.ctxShadow.stroke();
    }
}