document.addEventListener("DOMContentLoaded", function () {
    /* Linien animation */
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let lines = [];

    class Line {
        constructor() {
            this.segments = [];
            this.newSegment();
            this.newSegmentPossibility = 0.002;
            this.maxLength = (1 / 3) * canvas.width;
        }

        update() {
            const latestSegment = this.segments[this.segments.length - 1];
            latestSegment.length += 1;

            //Richtungsänderung
            if (Math.random() < this.newSegmentPossibility && latestSegment.length > ((1 / 5) * this.maxLength)) {
                this.newSegment();
            }

            //Trail kürzen
            const length = this.segments.reduce((acc, segment) => acc + segment.length, 0);
            if (length > this.maxLength) {
                let segInd = 0;
                if (this.segments[segInd].length > 0) {
                    this.segments[0].length--;
                    this.segments[0].start = [this.segments[0].start[0] + Math.cos(this.segments[0].angle * Math.PI / 180), this.segments[0].start[1] + Math.sin(this.segments[0].angle * Math.PI / 180)];
                }
                else {
                    while (this.segments[segInd].length === 0) {
                        segInd++;
                    }
                    this.segments.splice(0, segInd);
                }
                // Reset, wenn außerhalb des Canvas
                if (this.segments[0].start[0] < 0 || this.segments[0].start[0] > canvas.width || this.segments[0].start[1] < 0 || this.segments[0].start[1] > canvas.height)
                    this.reset();
            }
        }

        newSegment() {
            const lastAngle = this.segments.length === 0 ? -1 : this.segments[this.segments.length - 1].angle;
            let angle = lastAngle;
            while (angle == lastAngle || angle == this.oppositeAngle(lastAngle)) {
                angle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
            }
            let start;
            if (this.segments.length === 0) {
                start = [Math.random() * canvas.width, Math.random() * canvas.height]
            }
            else {
                const lastSegment = this.segments[this.segments.length - 1];
                start = [lastSegment.start[0] + Math.cos(lastSegment.angle * Math.PI / 180) * lastSegment.length, lastSegment.start[1] + Math.sin(lastSegment.angle * Math.PI / 180) * lastSegment.length];
            }
            this.segments.push({ 'start': start, 'angle': angle, 'length': 0 });
        }

        oppositeAngle(angle) {
            return (angle + 180) % 360;
        }

        reset() {
            this.segments = [];
            this.newSegment();
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.segments[0].start[0], this.segments[0].start[1]);
            this.segments.forEach(segment => {
                ctx.lineTo(segment.start[0] + Math.cos(segment.angle * Math.PI / 180) * segment.length, segment.start[1] + Math.sin(segment.angle * Math.PI / 180) * segment.length);
            });
            ctx.strokeStyle = 'rgba(38, 79, 79, 0.3)';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        requestAnimationFrame(animate);
    }

    /* Start */

    for (let i = 0; i < 10; i++)
        lines.push(new Line());
    animate();
});
