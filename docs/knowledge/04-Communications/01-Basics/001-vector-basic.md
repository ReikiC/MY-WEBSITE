---
title: 矢量运算基础（梯度 / 散度 / 旋度 / 拉普拉斯）
sidebar_position: 1
---

## 概述

本页介绍在电磁学与通信理论中常用的矢量分析算子：梯度（gradient）、散度（divergence）、旋度（curl）与拉普拉斯算子（Laplacian）。内容包括直观物理意义、在常见坐标系下的表达式、与麦克斯韦方程的联系。

## 直观意义

- 梯度 ∇f：作用于标量场 f(x)，给出最大变化方向和变化率（结果为向量）。用于表示势函数的方向和斜率。
- 散度 ∇·F：作用于矢量场 F(x)，输出标量，衡量该点是否为源（正散度）或汇（负散度）。例如电荷密度是电场散度的来源。
- 旋度 ∇×F：作用于三维矢量场，输出向量，衡量局部旋转性质或环流强度（涡量）。
- 拉普拉斯 ∆f = ∇·∇f：可作用于标量或向量，常出现在势场与波动方程中。

## 笛卡尔坐标（x,y,z）下的表达式

- 梯度：

$$
\nabla f = \left(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\right)
$$

- 散度：

$$
\nabla\cdot \mathbf{F} = \frac{\partial F_x}{\partial x}+\frac{\partial F_y}{\partial y}+\frac{\partial F_z}{\partial z}
$$

- 旋度：

$$
\nabla\times \mathbf{F} = \left(\frac{\partial F_z}{\partial y}-\frac{\partial F_y}{\partial z},\frac{\partial F_x}{\partial z}-\frac{\partial F_z}{\partial x},\frac{\partial F_y}{\partial x}-\frac{\partial F_x}{\partial y}\right)
$$

- 拉普拉斯（标量）：

$$
\Delta f = \nabla^2 f = \frac{\partial^2 f}{\partial x^2}+\frac{\partial^2 f}{\partial y^2}+\frac{\partial^2 f}{\partial z^2}
$$

## 柱坐标（r, θ, z）与球坐标（r, θ, φ）常用公式

为方便工程计算，以下给出常用的坐标系公式（仅写出重要结果，实际使用时请查表或推导确认）。


- 柱坐标 (r, θ, z)：

梯度：

$$
\nabla f = \hat{e}_r\frac{\partial f}{\partial r}+\hat{e}_\theta\frac{1}{r}\frac{\partial f}{\partial \theta}+\hat{e}_z\frac{\partial f}{\partial z}
$$

散度：

$$
\nabla\cdot \mathbf{F} = \frac{1}{r}\frac{\partial}{\partial r}(rF_r)+\frac{1}{r}\frac{\partial F_\theta}{\partial \theta}+\frac{\partial F_z}{\partial z}
$$

旋度（完整表达式）：

$$
\begin{aligned}
(\nabla\times \mathbf{F})_r &= \frac{1}{r}\frac{\partial F_z}{\partial \theta}-\frac{\partial F_\theta}{\partial z},\\
(\nabla\times \mathbf{F})_\theta &= \frac{\partial F_r}{\partial z}-\frac{\partial F_z}{\partial r},\\
(\nabla\times \mathbf{F})_z &= \frac{1}{r}\left(\frac{\partial}{\partial r}(rF_\theta)-\frac{\partial F_r}{\partial \theta}\right).
\end{aligned}
$$

标量拉普拉斯（柱坐标）：

$$
\nabla^2 f = \frac{1}{r}\frac{\partial}{\partial r}\left(r\frac{\partial f}{\partial r}\right)+\frac{1}{r^2}\frac{\partial^2 f}{\partial \theta^2}+\frac{\partial^2 f}{\partial z^2}.
$$

向量拉普拉斯（柱坐标分量形式）：令 $\mathbf{F}=F_r\hat{e}_r+F_\theta\hat{e}_\theta+F_z\hat{e}_z$，则

$$
\begin{aligned}
(\nabla^2\mathbf{F})_r &= \nabla^2 F_r - \frac{F_r}{r^2} - \frac{2}{r^2}\frac{\partial F_\theta}{\partial \theta},\\
(\nabla^2\mathbf{F})_\theta &= \nabla^2 F_\theta - \frac{F_\theta}{r^2} + \frac{2}{r^2}\frac{\partial F_r}{\partial \theta},\\
(\nabla^2\mathbf{F})_z &= \nabla^2 F_z,
\end{aligned}
$$

其中右侧的 $\nabla^2$（无下标）为作用于分量的标量拉普拉斯（如上所示）。


- 球坐标 (r, θ, φ)（常用物理学约定：θ 为极角，φ 为方位角）：

梯度：

$$
\nabla f = \hat{e}_r\frac{\partial f}{\partial r}+\hat{e}_\theta\frac{1}{r}\frac{\partial f}{\partial \theta}+\hat{e}_\phi\frac{1}{r\sin\theta}\frac{\partial f}{\partial \phi}
$$

散度：

$$
\nabla\cdot \mathbf{F} = \frac{1}{r^2}\frac{\partial}{\partial r}(r^2 F_r)+\frac{1}{r\sin\theta}\frac{\partial}{\partial \theta}(\sin\theta F_\theta)+\frac{1}{r\sin\theta}\frac{\partial F_\phi}{\partial \phi}
$$

旋度（完整表达式）：令 $\mathbf{F}=F_r\hat{e}_r+F_\theta\hat{e}_\theta+F_\phi\hat{e}_\phi$，则

$$
\begin{aligned}
(\nabla\times \mathbf{F})_r &= \frac{1}{r\sin\theta}\left(\frac{\partial}{\partial \theta}(\sin\theta F_\phi)-\frac{\partial F_\theta}{\partial \phi}\right),\\
(\nabla\times \mathbf{F})_\theta &= \frac{1}{r}\left(\frac{1}{\sin\theta}\frac{\partial F_r}{\partial \phi}-\frac{\partial}{\partial r}(rF_\phi)\right),\\
(\nabla\times \mathbf{F})_\phi &= \frac{1}{r}\left(\frac{\partial}{\partial r}(rF_\theta)-\frac{\partial F_r}{\partial \theta}\right).
\end{aligned}
$$

标量拉普拉斯（球坐标）：

$$
\nabla^2 f = \frac{1}{r^2}\frac{\partial}{\partial r}\left(r^2\frac{\partial f}{\partial r}\right)+\frac{1}{r^2\sin\theta}\frac{\partial}{\partial \theta}\left(\sin\theta\frac{\partial f}{\partial \theta}\right)+\frac{1}{r^2\sin^2\theta}\frac{\partial^2 f}{\partial \phi^2}.
$$

向量拉普拉斯：通常采用矢量恒等式

$$
\nabla^2\mathbf{F} = \nabla(\nabla\cdot\mathbf{F}) - \nabla\times(\nabla\times\mathbf{F})
$$

来计算球坐标下的分量；直接写出每个分量的完整展开式非常冗长（容易出错），因此推荐根据需要使用该恒等式并代入上面的散度与旋度表达式得到分量形式。

## 与麦克斯韦方程的联系（简要）

- 高斯定律（电）：$\nabla\cdot \mathbf{E}=\rho/\varepsilon_0$。电场的散度与电荷密度有关。
- 无磁单极：$\nabla\cdot \mathbf{B}=0$。磁场散度为零。
- 法拉第定律：$\nabla\times \mathbf{E}=-\partial\mathbf{B}/\partial t$。时间变化的磁场产生电场环流（旋度非零）。
- 安培—麦克斯韦：$\nabla\times \mathbf{H}=\mathbf{J}+\partial\mathbf{D}/\partial t$。电流与位移电流作为磁场旋度的源。

这些局部微分形式可通过斯托克斯定理与高斯定理转换为积分形式，便于实际计算与物理解释。


