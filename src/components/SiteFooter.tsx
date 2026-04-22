export const SiteFooter = () => (
  <footer className="mt-24 border-t border-primary/10 bg-gradient-mist">
    <div className="container py-12 grid md:grid-cols-3 gap-8 text-sm">
      <div>
        <div className="font-script text-3xl text-jade-aura mb-2">仙路行</div>
        <p className="text-muted-foreground leading-relaxed">
          Tiên Lộ Hành — cõi tu tiên huyền diệu, nơi vạn pháp quy nhất, đạo trải vô biên.
        </p>
      </div>
      <div>
        <h4 className="font-display text-base text-primary-deep mb-3 tracking-widest">CHÍN CẢNH GIỚI</h4>
        <ul className="space-y-1.5 text-muted-foreground">
          <li>Luyện Khí · Trúc Cơ · Kim Đan</li>
          <li>Nguyên Anh · Hoá Thần · Luyện Hư</li>
          <li>Hợp Thể · Đại Thừa · Độ Kiếp</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-base text-primary-deep mb-3 tracking-widest">TIÊN NGỮ</h4>
        <p className="font-script text-xl text-foreground/80 leading-loose">
          道法自然<br/>万物归一
        </p>
      </div>
    </div>
    <div className="border-t border-primary/10 py-4 text-center text-xs text-muted-foreground">
      © Tiên Lộ Hành · Đạo pháp tự nhiên
    </div>
  </footer>
);
